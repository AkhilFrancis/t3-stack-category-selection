'use client'
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import { api } from '~/trpc/react';

const Category = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const [selectedCategories, setSelectedCategories] = useState(new Set<string>());
  
  // Query to fetch paginated categories
  const { data: categoriesData, isPending: isLoadingCategories } =  api.category.list.useQuery({ page: currentPage, pageSize });
  
  // Query to fetch user's selected categories
  const { data: userCategoriesData, isPending: isLoadingUserCategories } = api.category.getUserCategories.useQuery();
  
  // Mutation to toggle category selection
  const toggleCategorySelection = api.category.toggleSelection.useMutation();
  
  // Effect to set selected categories once user categories data is fetched
  useEffect(() => {
    if (userCategoriesData) {
      const selectedIds = new Set(userCategoriesData.map(c => c.id));
      setSelectedCategories(selectedIds);
    }
  }, [userCategoriesData]);
  
  const handleToggleCategory = async (categoryId: string) => {
    // Optimistically update the UI for a responsive feel
    setSelectedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
    
    // Perform the mutation
    await toggleCategorySelection.mutateAsync({ categoryId });
  };

  const handleLogout = () => {
    Cookies.remove('authToken');

    // Redirect to the login page
    router.push('/');
  };

  
  if (isLoadingCategories || isLoadingUserCategories) {
    return <p>Loading...</p>;
  }

  const isNextButtonDisabled = currentPage >= (categoriesData?.totalPages ?? 1);

  return (
    <div>
      <h2>Select Your Interests</h2>
      {categoriesData?.categories.map(category => (
        <div key={category.id}>
          <label>
            <input
              type="checkbox"
              checked={selectedCategories.has(category.id)}
              onChange={() => handleToggleCategory(category.id)}
            />
            {category.name}
          </label>
        </div>
      ))}
      <div>
        <button disabled={currentPage <= 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
        <button disabled={isNextButtonDisabled} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Category;
