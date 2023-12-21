const ToDoList = artifacts.require("ToDoList");

contract('ToDoList', () => {
  it('should read newly written values', async() => {
    const ToDoListInstance = await ToDoList.deployed();
    var value = (await ToDoListInstance.read()).toNumber();

    assert.equal(value, 0, "0 wasn't the initial value");

    await ToDoListInstance.write(1);
    value = (await ToDoListInstance.read()).toNumber();
    assert.equal(value, 1, "1 was not written");

    await ToDoListInstance.write(2);
    value = (await ToDoListInstance.read()).toNumber();
    assert.equal(value, 2, "2 was not written");
  });
});
