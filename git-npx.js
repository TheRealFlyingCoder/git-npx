import arg from 'arg';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import os from 'os';
import {spawnSync} from 'child_process';
import AdmZip from 'adm-zip';
import axios from 'axios';
import camel from './scripts/camelMessages';
import brandMessage from './scripts/brandMessage';
import nextSteps from './scripts/nextStepsMessage';
const packageJson = require('./package.json');

function parseArguments(rawArgs) {
    const variables = {
        '--help': Boolean,
        '-h': '--help',
        '--version': Boolean,
        '-v': '--version',
    };
    const args = arg(variables, { argv: rawArgs.slice(2) });
    return {
        help: args['--help'] || false,
        version: args['--version'] || false,
        projectName: args._[0],
    };
}

function validateProjectName(projectName) {
    if (!projectName) {
        camel.error('Project name was not passed.');
        return false;
    } else if (!/^[A-Za-z0-9\-]+$/.test(projectName)) {
        camel.error('Project names should only have lowercase letters, numbers and dashes.');
        return false;
    }
    
    //Once validated, confirm the folder doesn't already exist
    const projectPath = path.join(process.cwd(), projectName);
    
    if (fs.existsSync(projectName)) {
        camel.error(`A project folder with that name already exists, at '${projectPath}'.`);
        return false;
    }

    return true;
}

export async function cli(args) {
    try{
        let options = parseArguments(args);
        if(options.help) {
            console.log(`You don\'t need help! Just run ${chalk.hex('#86BC25')('npx git-npx <project-name>')}!`);
        } else if (options.version) {
            console.log(packageJson.version);
        } else {
            let isValid = validateProjectName(options.projectName);
            if (isValid) {
                brandMessage();
                const destination = path.join(process.cwd(), options.projectName);
                fs.mkdirSync(destination);
                console.log(chalk.cyan(`Copying project template to ${destination}...`));
                try {
                    const gitUrl = packageJson.repository.url.replace('.git', '/zipball/master')
                    axios.get(gitUrl, {responseType: 'arraybuffer'}).then(res => {
                        const zip = new AdmZip(res.data);
                        const files = zip.getEntries();
                        files.forEach(file => {
                            //Only copy files as we are handling the folders
                            if (!file.entryName.endsWith('/')) {
                                let newDestination = destination;
                                //Remove the root directory
                                let entryPath = file.entryName.substring(file.entryName.indexOf('/') + 1, file.entryName.length);

                                //Get the new path for subdirectories
                                if(entryPath.includes('/') && entryPath.lastIndexOf('/') !== entryPath.length - 1) {
                                    //Just add the path to the file, not the file itself
                                    newDestination = path.join(newDestination, entryPath.substring(0, entryPath.lastIndexOf('/')))
                                }
                                
                                zip.extractEntryTo(file, newDestination, false, true);
                            }
                        })
                        console.log(chalk.green('Copy complete!'));
                        console.log('Running npm installation...');
                        const npmCmd = os.platform().startsWith('win') ? 'npm.cmd' : 'npm';
                        spawnSync(npmCmd, ['i', '--no-package-lock'], { env: process.env, cwd: destination, stdio: 'inherit' });
                        camel.success('Installation complete!');
                        nextSteps();
                    });
                } catch (e) {
                    camel.error(e);
                }
            }
        }
    } catch(e) {
        camel.error(e);
        process.exit(1);
    }
}

