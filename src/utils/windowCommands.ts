const exitProgram = async () => {
  //@ts-ignore
  await window.api.invoke("exitProgram");
};

export { exitProgram };
