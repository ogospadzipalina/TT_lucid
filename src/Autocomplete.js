import React, { useState } from 'react';
import { useQuery } from 'react-query';

const AutocompleteComponent = () => {
  const [query, setQuery] = useState('');

  const { data, isLoading, isError } = useQuery(
    ['autocomplete', query],
    async () => {
      const response = await fetch(`no-link-for-endpoint`);
      const data = await response.json();
      return data;
    },
    {
      enabled: query !== '',
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching data</div>;
  }

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <ul>
        {data.map((suggestion) => (
          <li key={suggestion.id}>{suggestion.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default AutocompleteComponent;
