#NoTrayIcon
#include <File.au3>

If $cmdline[0] <> 1 Then Exit

const $file = $cmdline[1]
_FilePrint($file, @SW_HIDE)