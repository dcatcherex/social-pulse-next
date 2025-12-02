import type { ContentTemplate, TemplateFormValues, ProcessedTemplate } from './types';

/**
 * Process template by replacing placeholders with form values
 * Supports both {{variable}} and {{#variable}}...{{/variable}} for conditionals
 */
export function processTemplate(
  template: ContentTemplate,
  formValues: TemplateFormValues
): ProcessedTemplate {
  const textPrompt = processPromptString(template.textPromptTemplate, formValues);
  const imagePrompt = processPromptString(template.imagePromptTemplate, formValues);

  return {
    textPrompt,
    imagePrompt,
    tone: template.suggestedTone,
    platforms: template.suggestedPlatforms,
    imageStyle: template.suggestedImageStyle,
  };
}

/**
 * Replace placeholders in a prompt string with actual values
 */
function processPromptString(prompt: string, values: TemplateFormValues): string {
  let result = prompt;

  // First, handle conditional blocks {{#key}}...{{/key}}
  // These only render if the value exists and is not empty
  const conditionalRegex = /\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g;
  result = result.replace(conditionalRegex, (_, key, content) => {
    const value = values[key];
    if (value && value.trim()) {
      // Replace the variable inside the conditional block
      return content.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    }
    return ''; // Remove the entire block if value is empty
  });

  // Then, handle simple replacements {{key}}
  const simpleRegex = /\{\{(\w+)\}\}/g;
  result = result.replace(simpleRegex, (_, key) => {
    return values[key] || '';
  });

  // Clean up extra whitespace and empty lines
  result = result
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');

  return result;
}

/**
 * Validate form values against template requirements
 * Returns array of error messages (empty if valid)
 */
export function validateTemplateForm(
  template: ContentTemplate,
  formValues: TemplateFormValues
): string[] {
  const errors: string[] = [];

  for (const variable of template.variables) {
    if (variable.required) {
      const value = formValues[variable.id];
      if (!value || !value.trim()) {
        errors.push(`${variable.label} is required`);
      }
    }
  }

  return errors;
}

/**
 * Get default form values from template variables
 */
export function getDefaultFormValues(template: ContentTemplate): TemplateFormValues {
  const defaults: TemplateFormValues = {};

  for (const variable of template.variables) {
    if (variable.defaultValue) {
      defaults[variable.id] = variable.defaultValue;
    } else {
      defaults[variable.id] = '';
    }
  }

  return defaults;
}

/**
 * Check if all required fields are filled
 */
export function isFormComplete(
  template: ContentTemplate,
  formValues: TemplateFormValues
): boolean {
  return template.variables
    .filter(v => v.required)
    .every(v => {
      const value = formValues[v.id];
      return value && value.trim().length > 0;
    });
}
