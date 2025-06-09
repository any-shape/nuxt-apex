use clap::Parser;
use std::{path::PathBuf};

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
    // Initialize logger with timestamps
    env_logger::Builder::from_default_env()
        .format_timestamp_secs()
        .init();

    let args = Args::parse();

    generate_all(&args)?;

    // if args.watch {
    //     info!("Starting async watch mode");
    //     watch_mode(&args).await?;
    // } else {
    //     info!("Generating all endpoints and index");
    //     generate_all(&args)?;
    // }
    Ok(())
}

fn generate_all(args: &Args) -> Result<(), Box<dyn std::error::Error>> {
    Ok(())
}
