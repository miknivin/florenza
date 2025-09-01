export default function DetailsInformation({ information }) {
  console.log(information);
  return (
    <>
      {information && information.length
        ? information.map((el, i) => (
            <div key={i + "information"} className="mt-5">
              <p>{el.details_text}</p>
              {/* {
              (el.keys && el.keys.length) && (el.data && el.data.length) ? : ''
            } */}
              <table style={{ borderCollapse: "collapse", width: "100%" }} className="mt-4">
                <thead>
                  <tr>
                    {el.keys && el.keys.length
                      ? el.keys.map((head, headI) => (
                          <th
                            key={headI + "headI"}
                            style={{
                              border: "1px solid #dddddd",
                              padding: "8px",
                            }}
                          >
                            {head}
                          </th>
                        ))
                      : ""}
                  </tr>
                </thead>
                <tbody>
                  {el.data && el.data.length
                    ? el.data.map((body, bodyI) => (
                        <tr key={bodyI + "body"}>
                          {body && body.length
                            ? body.map((item, i) => (
                                <td
                                  key={i + "item"}
                                  style={{
                                    border: "1px solid #dddddd",
                                    padding: "8px",
                                  }}
                                >
                                  {item}
                                </td>
                              ))
                            : ""}
                        </tr>
                      ))
                    : ""}
                </tbody>
              </table>
            </div>
          ))
        : ""}
    </>
  );
}
