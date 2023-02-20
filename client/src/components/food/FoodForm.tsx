import { PlusOutlined } from "@ant-design/icons";
import { faFilePen, faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { GREY } from "../../constants";
import { optionsCreateFood } from "../../constants/food.const";
import { useFood } from "../../contexts/food.context";
import { IFood, IFormInterface } from "../../interfaces";
import { SpacingDiv5X } from "../../styles/styledComponents/div.styled";
import { RowCenter } from "../styling/grid.styled";
import RediRadioButton from "../styling/RediRadioButton";

const FoodForm = () => {
  const {
    foodOrder,
    functions: { selectFood },
  } = useFood();
  const [form] = Form.useForm();
  const pictureValue = Form.useWatch("itemPhoto", form);
  const [newFoodMode, setNewFoodMode] = useState("false");

  const foodRadioOptions = [
    { label: "EDIT", value: "false", icon: <FontAwesomeIcon icon={faFilePen} /> },
    { label: "CREATE", value: "true", icon: <FontAwesomeIcon icon={faSquarePlus} /> },
  ];

  const [currentFood, setCurrentFood] = useState<IFood>(foodOrder[0]);

  const onFinish = (values: any) => {
    console.log("submitted", values);
    if (foodOrder[0] === currentFood) {
      console.log("can cancel");
    } else {
      console.log("cannot cancel");
    }
  };
  // const [previewOpen, setPreviewOpen] = useState(false);
  // const [previewImage, setPreviewImage] = useState("");
  // const [previewTitle, setPreviewTitle] = useState("");

  // const [fileList, setFileList] = useState<UploadFile[]>([]);

  // const onFinish = (values: any) => {};
  // const cancelUpload = () => setPreviewOpen(false);

  // const handlePreview = async (file: UploadFile) => {
  //   if (!file.url && !file.preview) {
  //     file.preview = await getBase64(file.originFileObj as RcFile);
  //   }
  //   setPreviewImage(file.url || (file.preview as string));
  //   setPreviewOpen(true);
  //   setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1));
  // };
  // const uploadButton = (
  //   <div style={{ border: `0.125rem dashed ${GREY}`, borderRadius: "50%", width: "100%" }}>
  //     <PlusOutlined />
  //     <div style={{ marginTop: 8 }}>Upload</div>
  //   </div>
  // );

  // const handlePictureChange: UploadProps["onChange"] = ({ fileList: newFileList }) => setFileList(newFileList);
  // const getBase64 = (file: RcFile): Promise<string> =>
  //   new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result as string);
  //     reader.onerror = (error) => reject(error);
  //   });

  // if (foodOrder[0] === currentFood) {

  useEffect(() => {
    if (newFoodMode === "false" && foodOrder[0]) {
      setCurrentFood(foodOrder[0]);
      form.setFieldsValue({
        itemName: foodOrder[0].itemName,
        itemDescription: foodOrder[0].itemDescription,
        itemPrice: foodOrder[0].itemPrice,
        itemPhoto: foodOrder[0].itemPhoto,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectFood]);
  return (
    <SpacingDiv5X>
      <RediRadioButton
        radioGroupName="food"
        padding="0.5rem 1rem"
        fontSize="0.75rem"
        options={foodRadioOptions}
        haveIcon={"true"}
        selectedButton={newFoodMode}
        setSelectedButton={setNewFoodMode}
      />
      <RowCenter style={{ marginTop: "1rem" }}>
        {pictureValue ? (
          <Image
            height={200}
            width={200}
            style={{ borderRadius: "50%", border: `1px dashed ${GREY}`, margin: "0 auto 1rem" }}
            src={pictureValue}
            alt="new food picture"
          />
        ) : (
          <RowCenter
            style={{
              width: 200,
              height: 200,
              border: `1px dashed ${GREY}`,
              margin: "0 auto 1rem",
              borderRadius: "50%",
            }}
          >
            <PlusOutlined /> Upload
          </RowCenter>
        )}
      </RowCenter>

      <Form form={form} onFinish={onFinish} layout="vertical">
        {optionsCreateFood.map(({ label, name, component, rules }: IFormInterface) => {
          return (
            <Form.Item style={{ fontWeight: 700 }} key={name} name={name} label={label} rules={rules}>
              {component}
            </Form.Item>
          );
        })}
        {/* <Form.Item style={{ fontWeight: 700 }} key={name} name={name} label={label} rules={rules}></Form.Item> */}
      </Form>
    </SpacingDiv5X>
  );
};

export default FoodForm;
