import { PlusOutlined } from "@ant-design/icons";
import { Card, Col, Form, Modal, Row, Typography } from "antd";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { Else, If, Then } from "react-if";
import { getOptions } from "../../../pages";
import { EFoodMode, IFood } from "../../../src/interfaces/food.interface";
import { GREY, LIGHT_GREY, noErrorInTable } from "../../constants";
import { optionsCreateFood } from "../../constants/food.const";
import AppContext from "../../contexts/app.context";
import { useFood } from "../../contexts/food.context";
import { checkIfArrayAreTheSame, sendErrorTableInput } from "../../functions/order.fn";
import { IErrorTableInput, IFormInterface, TStatusProps } from "../../interfaces";
import { SpacingDiv5X } from "../../styles/styledComponents/div.styled";
import { RowCenter } from "../styling/grid.styled";
import RediRadioButton from "../styling/RediRadioButton";
import FoodCard from "./FoodCard";
import OrderSection from "./OrderSection";

const { Title } = Typography;
interface IFoodLayoutProps {
  status: TStatusProps;
  foodList: IFood[];
  mode: EFoodMode;
  handleOrderCreate?: (foodOrder: IFood[]) => any;
  editOrder?: (foodOrder: IFood[]) => any;
  updateFood?: (food: IFood) => any;
  foodSection: string[];
  mainTitle: string;
}

const FoodLayout = ({ foodList, mode, foodSection, mainTitle, handleOrderCreate, status }: IFoodLayoutProps) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const tableTaken = [1, 4, 5];

  const pictureValue = Form.useWatch("itemPhoto", form);

  const { setStatus } = useContext(AppContext);
  const { foodOrder } = useFood();

  const [sortedFoods, setSortedFoods] = useState(foodList);
  const [selectedSection, setSelectedSection] = useState("all");

  const [tableNumberValue, setTableNumberValue] = useState<null | number>(null);
  const [errorTable, setErrorTable] = useState<IErrorTableInput>({ alreadyInDb: false, missingValue: false });
  const isDisabled = foodOrder.length === 0 ? true : false;

  const [currentOrder, setCurrentOrder] = useState<IFood[]>([]);
  const [cancelOrderModal, setCancelOrderModal] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const cancelUpload = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1));
  };
  const uploadButton = (
    <div style={{ border: `0.125rem dashed ${GREY}`, borderRadius: "50%", width: "100%" }}>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handlePictureChange: UploadProps["onChange"] = ({ fileList: newFileList }) => setFileList(newFileList);

  const changeActiveButton = (sectionName: string) => {
    console.log("section", sectionName);
    if (sectionName === "all") {
      return setSortedFoods(foodList);
    }
    let filteredfoods = foodList?.filter((food) => food.itemSection === sectionName);
    setSortedFoods(filteredfoods);
  };

  const handleSubmit = (foodOrder: IFood[]) => {
    switch (mode) {
      case EFoodMode.CREATE: {
        const result = sendErrorTableInput(tableNumberValue, tableTaken);
        if (result === noErrorInTable) {
          handleOrderCreate(foodOrder);
        } else {
          setErrorTable(result);
        }
      }
      default: {
      }
    }
  };
  // function that check if two array are the same

  const handleCancel = (link: string) => {
    if (!checkIfArrayAreTheSame(foodOrder, currentOrder)) {
      return setCancelOrderModal(true);
    }
    router.push(link);
    return setCancelOrderModal(false);
  };

  const loadData = async () => {
    setStatus(status);
    setCurrentOrder(foodOrder);
  };
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onFinish(values: any): void {
    throw new Error("Function not implemented.");
  }

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  return (
    <>
      <Title level={2}>{mainTitle}</Title>
      <Row gutter={[0, 40]} justify="space-between">
        <Col lg={15}>
          <RediRadioButton
            fontSize="1rem"
            padding="0.5rem 0.5rem"
            disabled={isDisabled}
            options={getOptions(foodSection)}
            radioGroupName="food"
            haveIcon="false"
            selectedButton={selectedSection}
            setSelectedButton={setSelectedSection}
            clickedFn={() => changeActiveButton(selectedSection)}
          />
          <Row gutter={[5, 10]}>
            {sortedFoods.map((food, index) => (
              <Col key={index} lg={6}>
                <FoodCard foodList={foodList} food={food} />
              </Col>
            ))}
          </Row>
        </Col>

        <Col lg={8}>
          <Card style={{ backgroundColor: LIGHT_GREY, boxShadow: "0 0 1rem rgba(0,0,0,0.3)", height: "100vh" }}>
            <If condition={mode !== EFoodMode.ALTER}>
              <Then>
                <OrderSection
                  tableNumber={tableNumberValue}
                  setTableNumber={setTableNumberValue}
                  mode={mode}
                  errorTable={errorTable}
                  handleSubmit={handleSubmit}
                  handleCancel={handleCancel}
                />
              </Then>
              <Else>
                <SpacingDiv5X>
                  {/* <Upload action="" fileList={fileList} onPreview={handlePreview} onChange={handlePictureChange}>
                    {fileList.length >= 8 ? null : uploadButton}
                  </Upload>
                  <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={cancelUpload}>
                    <Image alt="example" style={{ width: "100%" }} src={previewImage} />
                  </Modal> */}

                  {pictureValue ? (
                    <Image
                      style={{ width: 200, height: 200, border: `1px dashed ${GREY}`, margin: "0 auto 1rem" }}
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

                  <Form form={form} onFinish={onFinish} layout="vertical">
                    {optionsCreateFood.map(({ label, name, component, rules }: IFormInterface) => {
                      return (
                        <Form.Item style={{ fontWeight: 700 }} key={name} name={name} label={label} rules={rules}>
                          {component}
                        </Form.Item>
                      );
                    })}
                  </Form>
                </SpacingDiv5X>
              </Else>
            </If>
          </Card>
          <Modal
            title="Are u sure you want to cancel?"
            open={cancelOrderModal}
            onOk={() => router.push("/")}
            onCancel={() => setCancelOrderModal(!cancelOrderModal)}
          />
        </Col>
      </Row>
    </>
  );
};

export default FoodLayout;
