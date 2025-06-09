use clap::Parser;
use std::{error::Error, fs, path::{Path, PathBuf}};
use walkdir::WalkDir;

use oxc_allocator::Allocator;
use oxc_parser::Parser as OxcParser;
use oxc_span::SourceType;

use oxc_ast::ast::{
    Program,                      // the root AST node
    Statement,                    // each top-level "item" in a module
    ModuleDeclaration,            // `export default …` lives here
    Expression,                   // to match on your `CallExpression`
    CallExpression,               // the `defineAdwancedEventHandler<…>(…)` call
    ArrowFunctionExpression,      // the `async data => { … }`
    ReturnStatement,              // to pull out `return { … }`
    TsTypeReference,              // `Input` is a TsTypeReference
    TsTypeParameterInstantiation, // the `<Input, …>` list
};

use oxc_codegen::Codegen;

//https://github.com/oxc-project/oxc/blob/main/crates/oxc_parser/examples/parser.rs

/// CLI for generating per-endpoint modules and an index composable
#[derive(Parser, Debug)]
#[command(author, version, about = "Generate per-endpoint modules + index for Nuxt API", long_about = None)]
struct Args {
    /// Sourse directory path fpr api endpoints
    #[arg(long)]
    source: PathBuf,
    /// Output file path for the generated index composable
    #[arg(long)]
    output: PathBuf,
    /// Watch for changes and regenerate automatically
    #[arg(long)]
    watch: bool,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
  env_logger::Builder::from_default_env().format_timestamp_secs().init();

  // let args = Args::parse();

  let args = Args {
    source: PathBuf::from("C:/Users/Antony/Documents/coding/nuxt-api-generator/playground/server/api"),
    output: PathBuf::from("C:/Users/Antony/Documents/coding/nuxt-api-generator/playground/.nuxt/api-generator/api.ts"),
    watch: false,
  };

  let files = find_ts_files_with_methods(&args.source)?;
  for ts_path in files {
    println!("{}", ts_path.display());
  }

  Ok(())
}

fn find_ts_files_with_methods(source: &Path) -> Result<Vec<PathBuf>, Box<dyn Error>> {
  let mut result = Vec::new();

  for entry in WalkDir::new(source).into_iter().filter_map(Result::ok).filter(|e| e.file_type().is_file()){
    let path = entry.path();
    if path.extension().and_then(|s| s.to_str()).map_or(false, |ext| ext.eq_ignore_ascii_case("ts")) {
      if let Some(fname) = path.file_name().and_then(|s| s.to_str()) {
        let name = fname.to_ascii_lowercase();

        if name.contains(".get") || name.contains(".post") || name.contains(".put") || name.contains(".delete") {
          result.push(PathBuf::from(path.to_string_lossy().replace('\\', "/")));
        }
      }
    }
  }

  Ok(result)
}

fn extract_handler_types(path: &Path) -> Result<(String, String), Box<dyn Error>> {
    // 1) Load & parse
    let source_text = fs::read_to_string(path)?;
    let allocator = Allocator::default();
    let source_type = SourceType::from_path(path)
        .unwrap_or(SourceType::TypeScriptModule);
    let parser_ret = OxcParser::new(&allocator, &source_text, source_type).parse();
    let program: Program = parser_ret.program;

    let mut input_ts = String::new();
    let mut return_ts = String::new();
    let mut codegen = Codegen::new();

    // 2) Walk top-level statements
    for stmt in program.body {
        // Only care about `export default defineAdwancedEventHandler<…>(handler)`
        if let Statement::ModuleDeclaration(md) = stmt {
            if let ModuleDeclaration::ExportDefaultDeclaration(ed) = md {
                if let Expression::Call(CallExpression {
                    callee,
                    type_arguments: Some(TsTypeParameterInstantiation { params, .. }),
                    arguments,
                    ..
                }) = &*ed.declaration
                {
                    // Is it our helper?
                    if let Expression::Identifier(ident) = &**callee {
                        if ident.sym == *"defineAdwancedEventHandler" {
                            // --- 3) Extract the first generic param (Input) ---
                            if let Some(arg_ty) = params.get(0) {
                                // emit it directly
                                input_ts = codegen.build(arg_ty).code.trim_end().to_string();
                            }

                            // --- 4) Dive into the handler arrow function and find the `return` ---
                            if let Some(first_arg) = arguments.get(0) {
                                if let Expression::ArrowFunctionExpression(ArrowFunctionExpression { body, .. }) =
                                    &*first_arg.expression
                                {
                                    // Arrow bodies are either a block or an expression
                                    match body {
                                        // `{ return { … } }`
                                        oxc_ast::ast::FunctionBody::Block(stmt_list) => {
                                            for inner in &stmt_list.stmts {
                                                if let Statement::Return(ReturnStatement { argument: Some(expr), .. }) = inner {
                                                    return_ts = codegen.build(expr).code.trim_end().to_string();
                                                    break;
                                                }
                                            }
                                        }
                                        // `data => ({ … })`
                                        oxc_ast::ast::FunctionBody::Expr(expr) => {
                                            return_ts = codegen.build(expr).code.trim_end().to_string();
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    Ok((input_ts, return_ts))
}
