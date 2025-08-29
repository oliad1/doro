
interface IObjectsService {
  getUrl(object_id: string): Promise<string>
}

export default IObjectsService;
