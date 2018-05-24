#define MyAppName "Lupusiro"
#define MyAppVersion "0.1.0"
#define MyAppURL "https://github.com/KaguaKurusu/lupusiro"
#define MyAppExeName "Lupusiro.exe"
#define MyAppDir "..\release"

[Setup]
AppId={{107F4DBB-106E-4AC1-9EE1-6F958979D3B6}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
;AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher={cm:MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={pf}\{#MyAppName}
DisableProgramGroupPage=yes
LicenseFile=..\LICENSE
OutputDir=..\releases
OutputBaseFilename={#MyAppName}Setup
Compression=lzma
SolidCompression=yes
ArchitecturesAllowed=x64
ArchitecturesInstallIn64BitMode=x64
UninstallDisplayIcon={app}\{#MyAppName}.exe
UninstallDisplayName={#MyAppName}

[Languages]
Name: ja; MessagesFile: "compiler:Languages\Japanese.isl"

[CustomMessages]
ja.MyAppPublisher=�����؍g��
ja.DeleteSettingsData=�ݒ�t�@�C�����폜���܂����H

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"

[Files]
Source: "{#MyAppDir}\{#MyAppName}-win32-x64\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs; Check: Is64BitInstallMode
Source: "{#MyAppDir}\{#MyAppName}-win32-ia32\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs; Check: not Is64BitInstallMode
; NOTE: Don't use "Flags: ignoreversion" on any shared system files

[Icons]
Name: "{commonprograms}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{commondesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent

[Code]
var
	DeleteSettingsData: Boolean;
	AppDataDir: String;

procedure CurUninstallStepChanged(CurUninstallStep: TUninstallStep);
begin
	case CurUninstallStep of
		usUninstall:
			begin
				DeleteSettingsData := MsgBox(CustomMessage('DeleteSettingsData'), mbConfirmation, MB_YESNO) = idYes;
			end;
		usPostUninstall:
			begin
				if DeleteSettingsData = True then begin
					AppDataDir := GetEnv('APPDATA')
					DelTree(AppDataDir + '\{#MyAppName}', True, True, True);
				end;
			end;
	end;
end;
