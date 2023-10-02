const Message = ({ id, author, text, ups, downs, upCount, downCount }) => {
  return (
    <div className="flex justify-between border border-black rounded-md mb-2 px-2">
      <div className="flex ">
        <div className="flex flex-col mr-2">
          <button onClick={() => upCount(id)} className="my-1">
            🔼
          </button>
          <button onClick={() => downCount(id)} className="mb-1">
            🔽
          </button>
        </div>
        <div className="flex flex-col">
          <p className="font-bold">{author}</p>
          <p>{text}</p>
        </div>
      </div>
      <div>{ups - downs}</div>
    </div>
  );
};

export default Message;
