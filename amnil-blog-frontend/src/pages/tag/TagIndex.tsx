import { useEffect, useState } from "react";
import tagService from "../../services/tag.service";

export interface ITagData {
  _id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

const TagIndex = () => {
  const [tags, setTags] = useState<ITagData[]>();

  const fetchTags = async () => {
    try {
      const response = await tagService.getRequest("/tag");
      setTags(response.data);
      console.log("response: ", response);
    } catch (exception) {}
  };

  useEffect(() => {
    fetchTags();
  }, []);
  if (tags) {
    return (
      <div className="w-2xl mx-auto">
        <table className="bg-gray-300 w-full">
          <thead className="bg-pink-300">
            <tr>
              <th className="px-4 py-2 text-start">SN</th>
              <th className="px-4 py-2 text-start">Tag</th>
              <th className="px-4 py-2 text-end">Options</th>
            </tr>
          </thead>
          <tbody>
            {tags.map((tag , index) => {
              return (
                <tr>
                  <td className="px-4 py-2">{index +1 }</td>
                  <td className="px-4 py-2">{tag.title}</td>
                  <td className=" px-4 py-2 text-end"></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
};

export default TagIndex;
