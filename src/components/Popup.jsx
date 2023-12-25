/* eslint-disable react/prop-types */
import Button from "./Button";
import { useState, memo } from "react";
import SearchBar from "./SearchBar";
import { filterData } from "../helper";
import axios from "axios";

const data = [
  { label: "First Name", value: "first_name" },
  { label: "Last Name", value: "last_name" },
  { label: "Gender", value: "gender" },
  { label: "Age", value: "age" },
  { label: "Account Name", value: "account_name" },
  { label: "City", value: "city" },
  { label: "State", value: "state" },
];

const URL = "https://webhook.site/152c95fc-4e7a-436e-9e04-1ad3d1c498bd";

const Popup = ({ toggle }) => {
  const [filterText, setFilterText] = useState("");
  const [segmentList, setSegmentList] = useState("");
  const [schemaList, setSchemaList] = useState([]);
  const [allSchemaList, setAllSchemaList] = useState([]);

  function handleSchemaList() {
    if (segmentList === "")
      return alert("Enter the segment in the dropdown list");
    const isTrue = schemaList.find((s) => s === segmentList);
    if (isTrue !== undefined)
      return alert("Already selected choose other segment");
    setSchemaList((prevSchema) => {
      const selectedData = data.find((item) => item.value === segmentList);
      return [...prevSchema, selectedData.value];
    });
    setAllSchemaList((prevSchema) => {
      const selectedData = data.find((item) => item.value === segmentList);
      return [...prevSchema, selectedData.value];
    });

    setSegmentList("");
  }

  function reset() {
    setSchemaList([]);
    setAllSchemaList([]);
  }

  async function postData() {
    const dataToSend = {
      segment_name: "last_10_days_blog_visits",
      schema: schemaList.map((value) => {
        const item = data.find((item) => item.value === value);
        return { [value]: item ? item.label : value };
      }),
    };

    try {
      const response = await axios.post(URL, dataToSend);
      console.log("Data sent successfully:", response.data);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  }

  return (
    <aside className="aside">
      <div className="aside-content">
        <Header toggle={toggle} />
        <section className="section">
          <SearchBar
            title={"Enter the Name of the Segment"}
            filterText={filterText}
            setFilterText={setFilterText}
            filterData={filterData}
            allSchemaList={allSchemaList}
            setSchemaList={setSchemaList}
          />

          <p className="sub-title">
            To Save your segment, you need to add the schemas to build the query
          </p>

          <div className="traits">
            <div>
              <Traits color={"green-bgcolor"} />
              <div>-</div>
              <div>User Traits</div>
            </div>
            <div>
              <Traits color={"red-bgcolor"} />
              <div>-</div>
              <div>Group Traits</div>
            </div>
          </div>
          <Schemas
            schemaList={schemaList}
            setSchemaList={setSchemaList}
            filterText={filterText}
          />
          <DropdownList
            segmentList={segmentList}
            setSegmentList={setSegmentList}
          />
          <AddNewSchema schemaList={handleSchemaList} />
        </section>
        <Footer postData={postData} reset={reset} />
      </div>
    </aside>
  );
};

export default Popup;

function DropdownList({ segmentList, setSegmentList }) {
  return (
    <div className="segement-list">
      <Traits />
      <select
        id="segment"
        onChange={(e) => setSegmentList(e.target.value)}
        value={segmentList}
      >
        <option value="">Add schema to segment</option>
        {data.map((item) => {
          return <Options key={item.value} item={item} />;
        })}
      </select>
      <DeleteIcon />
    </div>
  );
}

function AddNewSchema({ schemaList }) {
  return (
    <div className="addSchema">
      <div>+</div>
      <div onClick={schemaList}>Add new schema</div>
    </div>
  );
}

function Schemas({ schemaList, setSchemaList }) {
  return (
    <>
      {schemaList?.map((selectedOption, index) => {
        return (
          <ListOfSegment
            key={index}
            selectedOption={selectedOption}
            schemaList={schemaList}
            setSchemaList={setSchemaList}
            index={index}
          />
        );
      })}
    </>
  );
}

const ListOfSegment = memo(function ListOfSegment({
  selectedOption,
  schemaList,
  setSchemaList,
  index,
}) {
  return (
    <div className="segement-list">
      <Traits color={"green-bgcolor"} />
      <select
        value={selectedOption}
        onChange={(event) => {
          const newDropdowns = [...schemaList];
          newDropdowns[index] = event.target.value;
          setSchemaList(newDropdowns);
        }}
      >
        {data.map((item) => (
          <option
            key={item.value}
            className={`${item?.value === selectedOption ? "hidden" : ""}`}
            value={item.value}
          >
            {item.label}
          </option>
        ))}
      </select>
      <DeleteIcon />
    </div>
  );
});

function Header({ toggle }) {
  return (
    <div className="header">
      <span onClick={toggle}>&lt;</span>
      <div className="title">Saving Segment</div>
    </div>
  );
}

function Footer({ postData, reset }) {
  return (
    <footer className="footer">
      <Button className="primary-btn white" onClick={postData}>
        Save the Segment
      </Button>
      <Button className="primary-btn danger" onClick={reset}>
        Cancel
      </Button>
    </footer>
  );
}

function DeleteIcon() {
  return <span className="delete-icon stretch"></span>;
}

function Traits({ color }) {
  return <span className={`circle ${color}`}></span>;
}

function Options({ item }) {
  return <option value={item.value}>{item.label}</option>;
}
