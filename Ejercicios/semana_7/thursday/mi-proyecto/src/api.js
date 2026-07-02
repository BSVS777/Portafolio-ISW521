const apiUrl = "https://jsonplaceholder.typicode.com/users";

export const obtenerResultados = async () => {
    
try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw Error("Network error");
    return await response.json();
}catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }

}



