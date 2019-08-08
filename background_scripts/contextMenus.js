const contextMenuItemParams = {
    "id": "Format Article",
    "title": "Format Article",
    "contexts": ["page"]
};

createContextMenuItem(contextMenuItemParams);

execWhenContextMenuItemIsClicked(contextMenuItemParams.id, () => {
    sendMessageToCurrentTab(contextMenuItemParams.id);
});