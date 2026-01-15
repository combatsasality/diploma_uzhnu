import { basename } from "path";

function getEntities(): unknown[] {
  const requireContext = require.context("../entities", false, /\.entity\.ts$/);

  return requireContext.keys().flatMap((relativePath) => {
    const mod = requireContext(relativePath);
    const moduleExports = mod as Record<string, unknown>;
    return Object.values(moduleExports).filter(
      (exp) => typeof exp === "function"
    );
  });
}

function getMigrations(): unknown[] {
  const migrations: Record<string, unknown> = {};

  const requireContext = require.context("../migrations", false, /\.ts$/);

  requireContext.keys().forEach((relativePath) => {
    const name = basename(relativePath);
    const module = requireContext(relativePath);
    migrations[name] = Object.values(module as Record<string, unknown>)[0];
  });

  const migrationsList = Object.keys(migrations).map((migrationName) => ({
    name: migrationName,
    class: migrations[migrationName],
  }));

  return migrationsList;
}

export { getEntities, getMigrations };
