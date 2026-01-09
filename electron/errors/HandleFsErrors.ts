export default function HandleFsErrors(error: NodeJS.ErrnoException) {
  switch (error.code) {
    case 'ENOENT':
      return 'Falha ao salvar: o caminho do arquivo não existe.';
    case 'EACCES':
      return 'Falha ao salvar: permissão negada para gravar o arquivo.';
    case 'EPERM':
      return 'Falha ao salvar: o sistema não permitiu modificar o arquivo.';
    case 'EBUSY':
      return 'Falha ao salvar: o arquivo está sendo usado por outro processo.';
    case 'ENOSPC':
      return 'Falha ao salvar: o disco está sem espaço.';
    case 'EISDIR':
      return 'Falha ao salvar: o caminho aponta para um diretório, não um arquivo.';
    case 'EMFILE':
      return 'Falha ao salvar: muitos arquivos abertos simultaneamente.';
    case 'ENOTDIR':
      return 'Falha ao salvar: parte do caminho não é um diretório válido.';
    case 'EINVAL':
      return 'Falha ao salvar: caminho inválido ou dados inválidos.';
    default:
      return 'Erro inesperado ao salvar arquivo!';
  }
}
