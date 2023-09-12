import { CompletionModel } from "./CompletionModel";

export class CompletionModelProvider {
  private _completionModel: CompletionModel;

  constructor(completionModel: CompletionModel) {
    this._completionModel = completionModel;
  }

  getCompletionModel(): CompletionModel {
    return this._completionModel;
  }

  setCompletionModel(completionModel: CompletionModel) {
    this._completionModel = completionModel;
  }
}
