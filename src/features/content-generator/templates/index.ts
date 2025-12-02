// Types
export type {
  TemplateCategory,
  TemplateFieldType,
  TemplateVariable,
  TemplateImageStyle,
  ContentTemplate,
  TemplateCategoryInfo,
  TemplateFormValues,
  ProcessedTemplate,
} from './types';

// Data
export {
  TEMPLATE_CATEGORIES,
  CONTENT_TEMPLATES,
  getTemplatesByCategory,
  getTemplateById,
  getCategoryInfo,
} from './template-data';

// Utils
export {
  processTemplate,
  validateTemplateForm,
  getDefaultFormValues,
  isFormComplete,
} from './template-utils';
