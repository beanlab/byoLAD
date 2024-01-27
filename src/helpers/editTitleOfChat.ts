  /**
   * Edits the title of the chat
   *
   * @param id
   * @param new_title
   */
  editTitleOfChat(id: number, new_title: string){
    const convo_to_update: Conversation | undefined = this.conversations.find(obj => obj.id == id)
    if (convo_to_update != undefined){
      convo_to_update.title = new_title;
      this.updateConversation(convo_to_update);
    } else {
      throw new Error("Cannot edit title: no conversation with id exists");
    }

  }