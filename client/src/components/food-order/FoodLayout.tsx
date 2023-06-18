import { Col, Modal, Row, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { Else, If, Then } from "react-if";
import { toast } from "react-toastify";
import { AxiosFunction } from "../../../pages/api/axios-request";
import { EOrderStatus, IFoodApi, IFoodOrder, IFoodSectionList, IGetServerSideData } from "../../../redifood-module/src/interfaces";
import { noErrorInTable } from "../../constants";
import AppContext from "../../contexts/app.context";
import { useFood } from "../../contexts/food.context";
import { NotificationRes } from "../../definitions/notification.class";
import { checkIfArrayAreTheSame, sendErrorTableInput } from "../../functions/order.fn";
import { useWindowSize } from "../../hooks/useWindowSIze.hook";
import { IErrorTableInput } from "../../interfaces";
import { EFoodMode } from "../../interfaces/food.interface";
import { LGCard } from "../../styles";
import { AnimToTop } from "../../styles/animations/global.anim";
import RediRadioButton from "../styling/RediRadioButton";
import { RowCenter } from "../styling/grid.styled";
import FoodCard from "./FoodCard";
import FoodForm from "./FoodForm";
import OrderSection from "./OrderSection";

const { Title } = Typography;
interface IFoodLayoutProps {
  status?: string;
  foods: IFoodApi[];
  mode: EFoodMode;
  updateFood?: (food: IFoodApi) => any;
  sectionList: IFoodSectionList[];
  mainTitle: string;
}

type TCreateOrderBody =   {orderTableNumber: number,
orderItems: IFoodOrder[];
}

type TUpdateOrderBody = {
  orderTableNumber: number,
orderItems: IFoodOrder[];
orderStatus: EOrderStatus
}



const FoodLayout = ({
  foods,
  mode,
  sectionList,
  mainTitle,
  status,
}: IFoodLayoutProps) => {
  const router = useRouter();

  const { setStatus } = useContext(AppContext);
  const { foodOrder } = useFood();

  const [foodSection] = useState<IFoodSectionList[]>(sectionList);
  const [foodList] = useState(foods);

  const [loading, setLoading] = useState(false);

  const [width] = useWindowSize();
  const widthBreakPoint = 768;
  const isLargeScreen = width && width > widthBreakPoint;

  const [sortedFoods, setSortedFoods] = useState(foodList);
  const [selectedSectionId, setSelectedSectionId] = useState(0);

  const [tableNumberValue, setTableNumberValue] = useState<null | number>(null);
  const [errorTable, setErrorTable] = useState<IErrorTableInput>({ alreadyInDb: false, missingValue: false });
  const isDisabled = foodOrder.length === 0 ? true : false;

  const [currentOrder, setCurrentOrder] = useState<IFoodApi[]>([]);
  const [cancelOrderModal, setCancelOrderModal] = useState(false);

  const [tableTakenList, setTableTakenList] = useState<number[]>([]);

  const changeActiveButton =(sectionId: number) => {
    setSelectedSectionId(sectionId)
    if (sectionId === 0) return setSortedFoods([...foodList]);
    const filteredfoods = [...foodList]?.filter((food) => food.sectionId === sectionId);
    return setSortedFoods([...filteredfoods]);
  }

  // api/orders/table
  const getTakenTableNumber = async () => {
    AxiosFunction({
      method: "get",
      url: "api/orders/table",
      body: {},
      queryParams: {}
    }).then((res: IGetServerSideData<number[]>) => {
      const { results} = res
      results && setTableTakenList(results)
    }).catch(() => toast.error("Error getting table number"))
  }


  const setFoodItemsForDb = (foodOrder: IFoodApi[]): IFoodOrder[] => {
    return [...foodOrder].map(({itemName, itemQuantity, id}) => {return {
      itemName, itemQuantity, id
    } as IFoodOrder})
  }



  const handleSubmit = (foodOrder: IFoodApi[]) => {
    setLoading(true)
    switch (mode) {
      case EFoodMode.CREATE: {
        const result = sendErrorTableInput(tableNumberValue as number, tableTakenList);
        if (result === noErrorInTable) {
          console.log("order created", foodOrder, tableNumberValue);
          const updatedFoodList = setFoodItemsForDb([...foodOrder])
          console.log('updated food list', updatedFoodList)
          const bodyCreateOrder: TCreateOrderBody = {
            orderTableNumber: tableNumberValue as number,
            orderItems: updatedFoodList
          }
          AxiosFunction({
            method: "post",
            url: "/api/orders",
            body: bodyCreateOrder,
            queryParams: {}
          }).then(() => {
            NotificationRes.onSuccess({
              title: "Order was succesfully created",
              description: "You will be redirected in 2 seconds",
              placement: "topRight",
            });
            router.replace("/");
            setLoading(false)
          }).then(() => {
            NotificationRes.onFailure({
              title: "Error creating order",
              description: "Please try again",
              placement: "topRight",
            });
            setLoading(false)
          })
        }
        else setErrorTable(result)
      }
      case EFoodMode.EDIT: {
        // if (editOrder) editOrder(foodOrder);
        const updatedFoodList = setFoodItemsForDb([...foodOrder])
        const bodyUpdateOrder: TUpdateOrderBody = {
          
        }
        AxiosFunction({
          method: "put",
          url: `/api/orders/`,
          // ${}`,
          body: bodyUpdateOrder,
          queryParams: {}
        })
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
    setStatus(status as string);
    setCurrentOrder(foodOrder);
  };

  useEffect(() => {
    if (mode === EFoodMode.CREATE) getTakenTableNumber()
    loadData();
  }, []);

  const setOptionsSelection = (foodSection: IFoodSectionList[]) => {
    const newFoodSection = [{label: 'ALL', value: 0, ariaLabel: 'ALL'}]
    const  options = [...foodSection].map((section) => {
      return {
        label: section.sectionName,
        value: section.id,
        ariaLabel: section.sectionName
      };
    });
    return [...newFoodSection, ...options];
  }

  const renderLGCard = () => {
    return (
      <LGCard style={{ height: "100%", width: "100%" }}>
        <If condition={mode !== EFoodMode.ALTER}>
          <Then>
            <OrderSection
              tableNumber={tableNumberValue}
              setTableNumber={setTableNumberValue}
              mode={mode} 
              loading={loading}
              errorTable={errorTable}
              handleSubmit={handleSubmit}
              handleCancel={handleCancel}
            />
          </Then>
          <Else>
            <FoodForm foodSection={foodSection} foodList={foodList} />
          </Else>
        </If>
      </LGCard>
    );
  };

  const ariaLabelMainTitle =
    mode === EFoodMode.ALTER ? "FOOD SECTION" : mode === EFoodMode.CREATE ? "CREATE ORDER" : "EDIT ORDER";

  return (
    <>
      <AnimToTop>
        <Title level={2} aria-label={ariaLabelMainTitle}>
          {mainTitle}
        </Title>
        <Row gutter={[0, 20]} justify="space-between" style={{ width: "100%" }}>
          <Col md={24} lg={15}>
            <RediRadioButton
              fontSize="1rem"
              padding="0.5rem 0.5rem"
              disabled={isDisabled}
              options={setOptionsSelection(foodSection) as any}
              radioGroupName="food"
              haveIcon="false"
              selectedButton={selectedSectionId}
              // setSelectedButton={setSelectedSectionId}
              clickedFn={changeActiveButton}
            />
            <Row gutter={[5, 10]}>
              {sortedFoods?.map((food, index) => (
                <Col key={index} xs={12} sm={12} md={8} lg={8} xl={6}>
                  <FoodCard foodList={foodList} food={food} mode={mode} />
                </Col>
              ))}
            </Row>
          </Col>

          {isLargeScreen && (
            <Col md={24} lg={8}>
              {renderLGCard()}
            </Col>
          )}
        </Row>
        {!isLargeScreen && <RowCenter style={{ marginTop: "1rem" }}>{renderLGCard()}</RowCenter>}
        <Modal
          title="Are u sure you want to cancel?"
          open={cancelOrderModal}
          onOk={() => router.push("/")}
          onCancel={() => setCancelOrderModal(!cancelOrderModal)}
        />
      </AnimToTop>
    </>
  );
};

export default FoodLayout;
