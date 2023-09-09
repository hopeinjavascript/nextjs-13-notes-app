const getFetchApiOptions = (method, body) => {
  return {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(method !== 'GET' && body && { body: JSON.stringify(body) }),
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
        abortRequest: controller.abort(), // keep a check... is it correct?
      };
    } catch (error) {
      controller.abort();
      return { error: true, resp: error };
    }
  };
}

export async function fetchNotes(context) {
  const controller = new AbortController();
  const signal = controller.signal;

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/notes`, {
    headers: {
      'Content-Type': 'application/json',
      Cookie: context.req.headers.cookie,
    },
    signal,
  });
  if (!res.ok) throw new Error('Network error');

  const notes = await res.json();
  return notes;
}

export async function fetchNoteById(context, noteId) {
  const controller = new AbortController();
  const signal = controller.signal;

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/notes/${noteId}`, {
    headers: {
      'Content-Type': 'application/json',
      Cookie: context.req.headers.cookie,
    },
    signal,
  });
  console.log(res);
  if (!res.ok) throw new Error('Network error');

  const notes = await res.json();
  return notes;
}
