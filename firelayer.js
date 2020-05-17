/*
|---------------------------------------------------------------------
| Firelayer Template Config File
|---------------------------------------------------------------------
|
| Suggestion Board
|
*/
module.exports = async function({ chalk, open, logger, prompt, targetDir }) {
  const website = 'https://firelayer.io/templates/board'

  console.log(`\nTemplate Documentation - ${chalk.bold.green(website)}\n`)

  open(website)
}
