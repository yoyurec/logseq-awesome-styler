export let doc: Document;
export let root: HTMLElement;
export let body: HTMLElement;
export let modalContainer: HTMLElement | null;

export const getDOMContainers = async () => {
    doc = parent.document;
    root = doc.documentElement;
    body = doc.body;
    modalContainer = doc.querySelector('.ui__modal');
}
