import React, { useCallback, useEffect } from 'react';
import useStore from './store';
import AutocompleteComponent from './AutocompleteComponent'; 

const CountingForm = () => {
  const { result, inputText, tags, editingTagId, setResult, setInputText, setTags, setEditingTagId } = useStore();

  const handleEvaluate = useCallback(() => {
    try {
      const expressionWithValues = inputText.replace(/(\w+)/g, (match) => {
        const foundTag = tags.find((tag) => tag.name === match);
        return foundTag ? foundTag.value : match;
      });

      const evaluationResult = eval(expressionWithValues);
      setResult(evaluationResult);
    } catch (error) {
      setResult('Error');
    }
  }, [inputText, setResult, tags]);

  useEffect(() => {
    handleEvaluate();
  }, [handleEvaluate, inputText, tags]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('sorry-no-link');
        const data = await response.json();
        setTags(data);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, [setTags]); 

  const handleTagDelete = (tagId) => {
    setTags((prevTags) => prevTags.filter((tag) => tag.id !== tagId));
  };

  const handleTagEdit = (tagId, newName) => {
    setTags((prevTags) =>
      prevTags.map((tag) =>
        tag.id === tagId ? { ...tag, name: newName } : tag
      )
    );
    setEditingTagId(null);
  };

  return (
    <div>
      <div>Result: {result}</div>
      <AutocompleteComponent
        query={inputText}
        onSuggestionSelected={(e, { suggestionValue }) => {
          setInputText((prevInput) => {
            const lastOperandIndex = Math.max(
              prevInput.lastIndexOf('+'),
              prevInput.lastIndexOf('-'),
              prevInput.lastIndexOf('*'),
              prevInput.lastIndexOf('/')
            );
            const prefix = prevInput.substring(0, lastOperandIndex + 1);
            return prefix + suggestionValue;
          });
        }}
      />
      <button type="button" onClick={handleEvaluate}>
        Evaluate
      </button>
      <div>
      {tags.map((tag) => (
          <div key={tag.id}>
            {editingTagId === tag.id ? (
              <input
                type="text"
                value={tag.name}
                onChange={(e) => handleTagEdit(tag.id, e.target.value)}
                onBlur={() => setEditingTagId(null)}
              />
            ) : (
              <>
                {tag.name}{' '}
                <button type="button" onClick={() => setEditingTagId(tag.id)}>
                  [Edit]
                </button>{' '}
                <button type="button" onClick={() => handleTagDelete(tag.id)}>
                  [Delete]
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountingForm;


