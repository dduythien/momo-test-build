const shell = require('child_process');
const execSyncFullLog = command => {
    shell.execSync(command, {
        stdio: 'inherit',
    });
};

module.exports = {
    execSyncFullLog,
};
