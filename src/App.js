import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);

  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleSelectedFriend(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleShowAddFriend(e) {
    e.preventDefault();
    setShowAddFriend((prevShowAddFriend) => !prevShowAddFriend);
  }

  function handleSplitSubmit(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelectedFriend(null);
  }

  const [friendName, setFriendName] = useState("");
  const [url, setUrl] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();
    if (!friendName || !url) return;

    const id = crypto.randomUUID();
    const newFriend = {
      name: friendName,
      image: `${url}?=${id}`,
      balance: 0,
      id,
    };

    setFriends((friends) => [...friends, newFriend]);
    setShowAddFriend(false);

    setFriendName("");
    setUrl("https://i.pravatar.cc/48");
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          onSelection={handleSelectedFriend}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && (
          <AddFriend
            onAddFreind={handleSubmit}
            friendName={friendName}
            onSetFriendName={setFriendName}
            url={url}
            onSetUrl={setUrl}
          />
        )}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          friends={friends}
          onSplit={handleSplitSubmit}
        />
      )}
    </div>
  );
}

function FriendList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const selected = selectedFriend?.id === friend.id;
  return (
    <li className={selected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {friend.balance}$
        </p>
      )}
      {friend.balance < 0 && (
        <p className="red">
          You owes {Math.abs(friend.balance)}$ to {friend.name}
        </p>
      )}
      {friend.balance === 0 && <p>You both are even</p>}

      <Button onClick={() => onSelection(friend)}>
        {selected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function AddFriend({
  onAddFreind,
  friendName,
  url,
  onSetFriendName,
  onSetUrl,
}) {
  return (
    <form className="form-add-friend" onSubmit={onAddFreind}>
      <label>🦸‍♂️ Friend name</label>
      <input
        type="text"
        value={friendName}
        onChange={(e) => onSetFriendName(e.target.value)}
      />

      <label>🏛 Image Url</label>
      <input
        type="text"
        value={url}
        onChange={(e) => onSetUrl(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, friends, onSplit }) {
  const [bill, setBill] = useState("");
  const [expense, setExpense] = useState("");
  const [paying, setPaying] = useState("user");

  const friendBill = bill - expense;

  function handleSubmit(e) {
    e.preventDefault();

    onSplit(paying === "user" ? friendBill : -expense);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split A Bill With {selectedFriend.name}</h2>

      <label>☠ Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(+e.target.value)}
      />

      <label>🦸‍♂️ Your Expense</label>
      <input
        type="text"
        value={expense}
        onChange={(e) => setExpense(+e.target.value)}
      />

      <label>🤝 {selectedFriend.name}'s Expense</label>
      <input type="text" disabled value={expense && friendBill} />

      <label>😑 Who Is Paying The Bill</label>
      <select onChange={(e) => setPaying(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}
