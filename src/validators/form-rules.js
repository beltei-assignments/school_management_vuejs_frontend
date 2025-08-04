export const FORM_RULES = {
  required: v => !!v || 'Field is required',
  email: v =>
    !v
    || /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v)
    || 'Please enter a valid email',
  min: (min, v) => v.length >= min || `Minimum length is ${min} characters`,
}
