import React from 'react';

export interface Session {
    title: string;
    description: string;
  }
  
const SessionList = ({sessions}:{sessions:Session[]}) => {
//   const [sessions, setSessions] = useState([]);
  return (
    <div className="session-list mb-4">
      {/* <h1 className="text-3xl font-bold text-center my-8">Sessions</h1> */}
      <ul className="list-disc pl-5 mb-5">
        {sessions.map((session, index) => (
          <li key={index} className="mb-4">
            <h2 className=" font-semibold text-[#902729]">{session.title}</h2>
            <p className={`text-sm text-gray-700`}>{session.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SessionList;