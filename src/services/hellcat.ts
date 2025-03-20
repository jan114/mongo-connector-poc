async function setDefaultTenants(userId: string): Promise<any> {
  try {
    const response = await fetch(`https://localhost:1234/v2/default_tenant_assign/${userId}`, {
      method: "POST",
      headers: {
        Authorization: "Basic aaa",
        "Content-Type": "application/json",
      },
    });
    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Error when assigning userId: ${userId} to default tenant. Hellcat response: ${error.message}, ${error.cause}`
      );
    }
    throw error;
  }
}

export default {setDefaultTenants};