# Unison Sync for Visual Studio Code
This extension allows running `unison` against a remote server.

> **Important**
> Both the local and remote server _must_ have unison installed and the version _should_ be the same to avoid issues.

## Configuration

Add "josegonzalez.unison-sync" configuration to user or workspace settings.

* "autoClearConsole" - (optional) clear VSCode output console every time commands run. Defaults to false.
* "profile" - (optional) The name of a profile to use for syncing (takes precedence over remote option)
* "remote" - (optional) A remote path to sync
* "shell" - (optional) shell path to be used with child_process.exec options that runs commands.

### Sample Config

This sample configuration will sync the local directory to the remote server example.com under the `/root/test` directory.

    "josegonzalez.unison-sync": {
		"remote": "ssh://root@example.com/test/"
	}

## Commands

The following commands are exposed in the command palette:
* On Save: Enable
* On Save: Disable

## Placeholder Tokens

Commands support placeholders similar to tasks.json.

* ${workspaceRoot}: DEPRECATED use ${workspaceFolder} instead
* ${workspaceFolder}: the path of the workspace folder of the saved file
* ${file}: path of saved file
* ${fileBasename}: saved file's basename
* ${fileDirname}: directory name of saved file
* ${fileExtname}: extension (including .) of saved file
* ${fileBasenameNoExt}: saved file's basename without extension
* ${relativeFile} - the current opened file relative to ${workspaceFolder}
* ${cwd}: current working directory (this is the working directory that vscode is running in not the project directory)

### Environment Variable Tokens

* ${env.Name}

## Links

* [Marketplace](https://marketplace.visualstudio.com/items/josegonzalez.UnisonSync)
* [Source Code](https://github.com/josegonzalez/vscode-unison)

## License

- [Apache](https://github.com/josegonzalez/vscode-vscode-unison/blob/master/LICENSE)
- [Upload in Cloud Icon](https://iconscout.com/icons/upload-in-cloud) by [Amit Jakhu](https://iconscout.com/contributors/amit-jakhu) on [IconScout](https://iconscout.com).