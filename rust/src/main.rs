use std::{fs, path::Path};

use oxc::allocator::Allocator;
use oxc::parser::Parser;
use oxc::span::SourceType;
use oxc_semantic::{SemanticBuilder, SemanticBuilderReturn};
use oxc_ast::ast::{Expression, Tsca, TsExportAssignment};
use oxc_ast_visit::{Visit};

fn main() {
}
