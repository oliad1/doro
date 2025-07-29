import { Term } from "@/types/Types";

const getTerm = async (): Promise<string | null> => {
  try {
    const response = await fetch('/api/cookies/term');
    const { data, error, status } = await response.json();

    if (error) {
      throw new Error(`Response status: ${status}`);
    }

    if (!data){
      throw new Error(`Response status: ${status}`);
    }

    return data;
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
}

const setTerm = async (term: Term): Promise<void> => {
  try {
    const response = await fetch('/api/cookies/term/', {
      method: 'POST',
      headers: {
	'Content-Type': 'application/json'
      },
      body: JSON.stringify(term)
    });

    const { error, status } = await response.json();

    if (error) {
      throw new Error(`Response status: ${status}`);
    }
  } catch (error) {
    console.log("Error:", error);
  }
};

const getSidebarOpen = async (): Promise<boolean | null> => {
  try {
    const response = await fetch('/api/cookies/sidebar');
    const { data, error, status } = await response.json();

    if (error) {
      throw new Error(`Response status: ${status}`);
    }

    if (data===null || data===undefined){
      throw new Error(`Response status: ${status}`);
    }

    return data;
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
}

export default {
  getTerm,
  setTerm,
  getSidebarOpen,
};
