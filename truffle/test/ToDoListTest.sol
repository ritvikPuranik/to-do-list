// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../contracts/ToDoList.sol";
// These files are dynamically created at test time
import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";

contract ToDoListTest {

  function testWriteValue() public {
    ToDoList ToDoList = ToDoList(DeployedAddresses.ToDoList());

    Assert.equal(ToDoList.read(), 0, "Contract should have 0 stored");
    ToDoList.write(1);
    Assert.equal(ToDoList.read(), 1, "Contract should have 1 stored");
    ToDoList.write(2);
    Assert.equal(ToDoList.read(), 2, "Contract should have 2 stored");
  }
}
