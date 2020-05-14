/*
|---------------------------------------------------------------------
| Firelayer Template Config File
|---------------------------------------------------------------------
|
| Board - Default template for `firelayer init`
|
*/
module.exports = async function({ chalk, open, logger, prompt, targetDir }) {
  const website = 'https://firelayer.io/templates/board'

  console.log(`\nTemplate Documentation - ${chalk.bold.green(website)}\n`)

  open(website)
}
