const getFetchApiOptions = (method, body) => {
  return {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(method !== 'GET' && { body: JSON.stringify(body) }),
  };
};

export default function useFetch() {
  return async (url, method = 'GET', options = {}) => {
    const controller = new AbortController();
    const signal = controller.signal;

    const opts = getFetchApiOptions(method, options.body);

    try {
      const res = await fetch(url, {
        ...opts,
        signal,
      });
      if (!res.ok) throw new Error('Network error');

      const data = await res.json();

      return {
        error: false,
        resp: data,
        abortRequest: controller.abort(),
      };
    } catch (error) {
      controller.abort();
      return { error: true, resp: error };
    }
  };
}
