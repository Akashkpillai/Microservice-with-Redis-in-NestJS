import * as path from 'path';
import * as fs from 'fs';
import * as Handlebars from 'handlebars';

export class TemplateLoader {
  private templatesDir: string;

  constructor() {
    // Determine the base path dynamically
    const basePath =
      process.env.NODE_ENV === 'production'
        ? path.join(process.cwd(), 'dist')
        : path.join(process.cwd(), 'src');

    this.templatesDir = path.join(basePath, 'templates');
  }

  loadTemplate(templateName: string, data: Record<string, any>): string {
    const filePath = path.join(this.templatesDir, `${templateName}.hbs`);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Template file not found: ${filePath}`);
    }

    const templateContent = fs.readFileSync(filePath, 'utf8');
    const template = Handlebars.compile(templateContent);
    return template(data);
  }
}
