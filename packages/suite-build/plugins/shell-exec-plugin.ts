import webpack from 'webpack';
import { exec } from 'child_process';

interface Options {
    cwd?: string;
    runAfterBuild?: string;
    runAfterWatch?: string;
}

const defaultOptions: Options = {};

class ShellExecPlugin {
    initialRun = false;
    options: Options;

    constructor(options: Options) {
        this.options = {
            ...defaultOptions,
            ...options,
        };
    }

    apply(compiler: webpack.Compiler) {
        compiler.hooks.afterEmit.tap('RunAfterPlugin', (_: webpack.Compilation) => {
            if (!this.initialRun) {
                this.initialRun = true;

                if (this.options.runAfterBuild) {
                    exec(this.options.runAfterBuild, { cwd: this.options.cwd });
                }
            } else if (this.options.runAfterWatch) {
                exec(this.options.runAfterWatch, { cwd: this.options.cwd });
            }
        });
    }
}

export default ShellExecPlugin;
