const Message = ({
  id,
  author,
  text,
  ups,
  downs,
  upCount,
  downCount,
  admin,
  delete_,
}) => {
  const extractLinks = (text) => {
    const linkRegex =
      /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim;
    let links = text.match(linkRegex);

    links = links === null ? [] : links;

    text = text.replace(linkRegex, "");

    return { links, text };
  };

  return (
    <div className="my-2 ">
      <div
        className={`flex justify-between border border-black ${
          extractLinks(text).links.length > 0 ? "rounded-t-md" : "rounded-md"
        } pr-2`}
      >
        <div className="flex w-full">
          {admin ? (
            <button
              className="rounded-l-md flex flex-col justify-center px-3 bg-gray-300"
              onClick={() => delete_(id)}
            >
              🗑️
            </button>
          ) : (
            <div className="flex flex-col mr-2">
              <button onClick={() => upCount(id)} className="my-1">
                🔼
              </button>
              <button onClick={() => downCount(id)} className="mb-1">
                🔽
              </button>
            </div>
          )}
          <div className="flex flex-col ml-2">
            <p className="font-bold">{author}</p>
            <p className="w-[95%]">{extractLinks(text).text}</p>
          </div>
        </div>
        <div>{ups - downs}</div>
      </div>
      {extractLinks(text).links.length > 0 ? (
        <div className="px-2 border-b border-x border-black rounded-b-md text-blue-800 underline">
          {extractLinks(text).links.map((link) => {
            return (
              <p style={{ overflowWrap: "break-word", wordBreak: "break-all" }}>
                <a target="_blank" href={link}>
                  {link}
                </a>
              </p>
            );
          })}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Message;
