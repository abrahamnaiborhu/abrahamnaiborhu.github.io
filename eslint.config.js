import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import hooks from 'eslint-plugin-react-hooks';

// Legacy JS remains a reference, with its existing debt visible via lint:legacy.
export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', 'docs/**'] },
  { files: ['**/*.ts', '**/*.tsx'], extends: [js.configs.recommended, ...tseslint.configs.recommended],
    plugins: { 'react-hooks': hooks }, rules: { ...hooks.configs.recommended.rules } },
  { files: ['vite.config.js', 'eslint.config.js'], ...js.configs.recommended },
);
