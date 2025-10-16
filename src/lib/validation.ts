// 表单验证规则

export const validationRules = {
  // 邮箱验证
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: '请输入有效的邮箱地址',
  },

  // 手机号验证（中国大陆）
  phone: {
    pattern: /^1[3-9]\d{9}$/,
    message: '请输入有效的手机号码',
  },

  // 密码验证
  password: {
    minLength: 6,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
    message: '密码至少6位，包含大小写字母和数字',
  },

  // 用户名验证
  username: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
    message: '用户名只能包含字母、数字和下划线，长度3-20位',
  },

  // 必填验证
  required: {
    required: true,
    message: '此字段为必填项',
  },
};

// 验证规则联合类型
type ValidationRule =
  | typeof validationRules.email
  | typeof validationRules.phone
  | typeof validationRules.password
  | typeof validationRules.username
  | typeof validationRules.required;

// 验证函数
export const validateField = (value: string, rule: ValidationRule): string | null => {
  if ('required' in rule && !value) {
    return rule.message;
  }

  if ('minLength' in rule && typeof rule.minLength === 'number' && value.length < rule.minLength) {
    return `最少需要${rule.minLength}个字符`;
  }

  if ('maxLength' in rule && typeof rule.maxLength === 'number' && value.length > rule.maxLength) {
    return `最多只能${rule.maxLength}个字符`;
  }

  if ('pattern' in rule && rule.pattern && !rule.pattern.test(value)) {
    return rule.message;
  }

  return null;
};

// 常用验证组合
export const commonValidations = {
  email: (value: string) => validateField(value, validationRules.email),
  phone: (value: string) => validateField(value, validationRules.phone),
  password: (value: string) => validateField(value, validationRules.password),
  username: (value: string) => validateField(value, validationRules.username),
  required: (value: string) => validateField(value, validationRules.required),
};
