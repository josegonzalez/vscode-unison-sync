import * as vscode from 'vscode';
import {exec} from 'child_process';

export function activate(context: vscode.ExtensionContext): void {

	var extension = new UnisonSyncExtension(context);
	extension.showOutputMessage();

	vscode.workspace.onDidChangeConfiguration(() => {
		let disposeStatus = extension.showStatusMessage('Unison Sync: Reloading config.');
		extension.loadConfig();
		disposeStatus.dispose();
	});

	vscode.commands.registerCommand('extension.josegonzalez.enableUnisonSync', () => {
		extension.isEnabled = true;
	});

	vscode.commands.registerCommand('extension.josegonzalez.disableUnisonSync', () => {
		extension.isEnabled = false;
	});

	vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
		extension.runUnison(document);
	});
}

interface ICommand {
	cmd: string;
}

interface IConfig {
	shell: string;
	autoClearConsole: boolean;
	profile: string;
	remote: string;
}

class UnisonSyncExtension {
	private _outputChannel: vscode.OutputChannel;
	private _context: vscode.ExtensionContext;
	private _config: IConfig;

	constructor(context: vscode.ExtensionContext) {
		this._context = context;
		this._outputChannel = vscode.window.createOutputChannel('Unison Sync');
		this.loadConfig();
	}

	/** Recursive call to run commands. */
	private _runCommand(
		command: ICommand,
		document: vscode.TextDocument
	): void {
		this.showOutputMessage(`*** unison sync start`);

		var child = exec(command.cmd, this._getExecOption(document));
		child.stdout.on('data', data => this._outputChannel.append(data));
		child.stderr.on('data', data => this._outputChannel.append(data));
		child.on('error', (e) => {
			this.showOutputMessage(e.message);
		});

		this.showStatusMessage('*** unison sync complete');
	}

	private _getExecOption(
		document: vscode.TextDocument
	): {shell: string, cwd: string} {
		return {
			shell: this.shell,
			cwd: this._getWorkspaceFolderPath(document.uri),
		};
	}

	private _getWorkspaceFolderPath(
		uri: vscode.Uri
	) {
		const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);

		// NOTE: rootPath seems to be deprecated but seems like the best fallback so that
		// single project workspaces still work. If I come up with a better option, I'll change it.
		return workspaceFolder
			? workspaceFolder.uri.fsPath
			: vscode.workspace.rootPath;
	}

	public get isEnabled(): boolean {
		return !!this._context.globalState.get('isEnabled', true);
	}
	public set isEnabled(value: boolean) {
		this._context.globalState.update('isEnabled', value);
		this.showOutputMessage();
	}

	public get shell(): string {
		return this._config.shell;
	}

	public get autoClearConsole(): boolean {
		return !!this._config.autoClearConsole;
	}

	public get profile(): string {
		return this._config.profile;
	}

	public get remote(): string {
		return this._config.remote;
	}

	public loadConfig(): void {
		this._config = <IConfig><any>vscode.workspace.getConfiguration('josegonzalez.unison-sync');
	}

	/**
	 * Show message in output channel
	 */
	public showOutputMessage(message?: string): void {
		message = message || `Unison Sync ${this.isEnabled ? 'enabled': 'disabled'}.`;
		this._outputChannel.appendLine(message);
	}

	/**
	 * Show message in status bar and output channel.
	 * Return a disposable to remove status bar message.
	 */
	public showStatusMessage(message: string): vscode.Disposable {
		this.showOutputMessage(message);
		return vscode.window.setStatusBarMessage(message);
	}

	public runUnison(document: vscode.TextDocument): void {
		if(this.autoClearConsole) {
			this._outputChannel.clear();
		}

		if(!this.isEnabled) {
			this.showOutputMessage();
			return;
		}

		const commands: Array<ICommand> = [];
		if (this.profile.length > 0) {
			this.showStatusMessage('Running unison...');
			this._runCommand({
				cmd: `unison ${this.profile}`,
			}, document)
		} else if (this.remote.length > 0) {
			const workspaceFolderPath = this._getWorkspaceFolderPath(document.uri);
			this.showStatusMessage('Running unison...');
			this._runCommand({
				cmd: `unison '${workspaceFolderPath} '${this.remote}'`,
			}, document)
		}

		if (commands.length === 0) {
			this.showOutputMessage();
			return;
		}
	}
}
