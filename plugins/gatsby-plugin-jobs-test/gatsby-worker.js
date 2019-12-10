
const sleep = (timeout) => new Promise(resolve => setTimeout(resolve, timeout))

exports.JOB_TEST = async ({ args }) => {
  await sleep(2000);

  return args;
}