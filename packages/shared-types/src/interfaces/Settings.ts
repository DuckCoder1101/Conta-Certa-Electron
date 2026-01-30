export default interface ISettings {
  theme: 'light' | 'dark' | 'system';
  language: 'pt-BR' | 'en-US';
  autoUpdate: boolean;
  autoBilling: boolean;
  autoBackup: boolean;
}