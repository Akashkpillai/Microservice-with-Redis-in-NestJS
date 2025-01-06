import * as path from 'path';
import * as fs from 'fs';
// import * as Handlebars from 'handlebars';
import * as hbs from 'hbs';

export class TemplateLoader {
  private readonly templatePath = path.join(
    process.cwd(),
    'src',
    'mailer',
    'templates',
  );
  /**
   * Loads and compiles an HBS template.
   * @param templateName Name of the template file (without `.hbs` extension)
   * @param data Data to interpolate into the template
   * @returns Rendered HTML as a string
   */
  async renderTemplate(
    templateName: string,
    data: Record<string, any>,
  ): Promise<string> {
    try {
      // Resolve the full path of the template
      const filePath = path.join(this.templatePath, `${templateName}.hbs`);

      // Read the template content
      const templateContent = await fs.promises.readFile(filePath, 'utf8');

      // Compile the template
      const compiledTemplate = hbs.compile(templateContent);

      // Render the template with data
      return compiledTemplate(data);
    } catch (error) {
      throw new Error(
        `Error loading template "${templateName}": ${error.message}`,
      );
    }
  }
}
