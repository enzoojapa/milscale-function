import fs from 'fs';
import path from 'path';

const SRC = path.resolve(__dirname, '../../src');

function arquivos(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? arquivos(p) : p.endsWith('.ts') ? [p] : [];
  });
}

const imports = (f: string) => [...fs.readFileSync(f, 'utf8').matchAll(/from\s+['"]([^'"]+)['"]/g)].map((m) => m[1]);

describe('Camadas da Function', () => {
  it('domain nao depende de application, functions nem do SDK do Azure', () => {
    const erros = arquivos(path.join(SRC, 'domain')).flatMap((f) =>
      imports(f).filter((i) => i.includes('application') || i.includes('functions') || i.startsWith('@azure')),
    );
    expect(erros).toEqual([]);
  });

  it('application nao depende do SDK @azure/functions', () => {
    const erros = arquivos(path.join(SRC, 'application')).flatMap((f) => imports(f).filter((i) => i.startsWith('@azure')));
    expect(erros).toEqual([]);
  });

  it('cada arquivo em functions registra apenas um gatilho', () => {
    arquivos(path.join(SRC, 'functions')).forEach((f) => {
      const gatilhos = fs.readFileSync(f, 'utf8').match(/app\.(http|serviceBusQueue|timer)\(/g) ?? [];
      expect(gatilhos).toHaveLength(1);
    });
  });
});
