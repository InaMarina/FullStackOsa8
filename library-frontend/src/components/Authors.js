import React from 'react';
import { useState } from 'react';
import Select from 'react-select';

import { useQuery, useMutation } from '@apollo/client';
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries';

const Authors = (props) => {
  const [name, setName] = useState('');
  const [year, setYear] = useState('');

  const [editAuthor] = useMutation(EDIT_AUTHOR);
  const result = useQuery(ALL_AUTHORS, {
    pollInterval: 2000,
  });
  if (result.loading) {
    return <div>loading...</div>;
  }
  if (!props.show) {
    return null;
  }

  const authors = result.data.allAuthors;
  const authorNames = [...authors].map((a) => ({
    label: a.name,
    value: a.name,
  }));

  const submit = async (event) => {
    event.preventDefault();

    const setBornTo = Number(year);
    console.log('updating author birthyear');
    editAuthor({ variables: { name, setBornTo } });

    setName('');
    setYear('');
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <h2>Set birthyear</h2>
        <form onSubmit={submit}>
          <div>
            name
            <Select onChange={setName} options={authorNames} />
          </div>
          <div>
            born
            <input
              value={year}
              onChange={({ target }) => setYear(target.value)}
            />
          </div>
          <div>
            <button type="submit">update author</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Authors;
