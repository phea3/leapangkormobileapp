import { useState, useEffect, useContext } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigate } from "react-router-native";
import { useMutation, useQuery } from "@apollo/client";
import HomeStyle from "../styles/HomeStyle.scss";
import LeaveStyle from "../styles/LeaveStyle.scss";
import { GET_LEAVE_LIST } from "../graphql/RequestLeave";
import { AuthContext } from "../Context/AuthContext";
import * as Animatable from "react-native-animatable";
import { moderateScale } from "../ Metrics";
import { CANCELLEAVE } from "../graphql/CancelLeave";
import ModalStyle from "../styles/ModalStyle.scss";

export default function LeaveScreen() {
  const navigate = useNavigate();
  const [leavListData, setLeaveData] = useState([]);
  const [limit, setLimit] = useState(10);
  const { dimension } = useContext(AuthContext);
  const [load, setLoad] = useState(true);
  const [CheckIsVisible, setCheckVisible] = useState(false);

  const handleCheckClose = () => {
    setCheckVisible(false);
  };

  const handleCheckOpen = () => {
    setCheckVisible(true);
  };

  useEffect(() => {
    setTimeout(() => {
      setLoad(false);
    }, 1000);
  }, []);

  const { data, refetch, loading } = useQuery(GET_LEAVE_LIST, {
    pollInterval: 2000,
    variables: {
      limit: limit,
    },
    onCompleted: ({ getLeaveListForMobile }) => {
      // console.log(data?.getLeaveListForMobile);
      setLeaveData(getLeaveListForMobile);
    },
    onError: (err) => {
      console.log(err?.message);
    },
  });

  useEffect(() => {
    refetch();
  }, []);

  const [CancelLeave] = useMutation(CANCELLEAVE, {
    onCompleted: ({ cancelLeave }) => {
      setTimeout(() => {
        refetch();
      }, 500);
    },
    onError: (error: any) => {
      console.log(error);
    },
  });

  const [leaveId, setLeaveId] = useState("");

  const handleCancelLeave = async () => {
    await CancelLeave({
      variables: {
        leaveId: leaveId,
        hrComment: " ",
      },
    });
  };
  return (
    <View
      style={[
        LeaveStyle.LeaveContainer,
        {
          borderTopLeftRadius: moderateScale(15),
          borderTopRightRadius: moderateScale(15),
          borderTopWidth: moderateScale(1),
          borderRightWidth: moderateScale(1),
          borderLeftWidth: moderateScale(1),
        },
      ]}
    >
      <Modal
        visible={CheckIsVisible}
        animationType="none"
        onRequestClose={handleCheckClose}
        transparent={true}
      >
        <View style={ModalStyle.ModalContainer}>
          <TouchableOpacity
            style={ModalStyle.ModalBackgroundOpacity}
            onPress={handleCheckClose}
            activeOpacity={0.2}
          />
          <View
            style={[
              ModalStyle.ModalButtonContainerMain,
              {
                height: moderateScale(200),
                borderRadius: moderateScale(10),
                borderWidth: moderateScale(1),
              },
            ]}
          >
            <View
              style={[
                ModalStyle.ModalButtonTextTitleContainerMain,
                { padding: moderateScale(20) },
              ]}
            >
              <Text
                style={[
                  ModalStyle.ModalButtonTextTitleMain,
                  { fontSize: moderateScale(16) },
                ]}
              >
                {"Do you want to cancel leave?"}
              </Text>
            </View>

            <View style={ModalStyle.ModalButtonOptionContainer}>
              <TouchableOpacity
                onPress={() => handleCheckClose()}
                style={[
                  ModalStyle.ModalButtonOptionLeft,
                  {
                    padding: moderateScale(15),
                    borderTopWidth: moderateScale(1),
                  },
                ]}
              >
                <Text
                  style={[
                    ModalStyle.ModalButtonTextTitleMain,
                    { fontSize: moderateScale(16) },
                  ]}
                >
                  No
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleCheckClose();
                  handleCancelLeave();
                }}
                style={[
                  ModalStyle.ModalButtonOptionLeft,
                  {
                    padding: moderateScale(15),
                    borderLeftWidth: moderateScale(1),
                    borderTopWidth: moderateScale(1),
                  },
                ]}
              >
                <Text
                  style={[
                    ModalStyle.ModalButtonTextTitleMain,
                    { fontSize: moderateScale(16) },
                  ]}
                >
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={LeaveStyle.LeaveBackButtonContainer}>
        <TouchableOpacity
          onPress={() => navigate("/home")}
          style={[
            HomeStyle.HomeFeaturesTitleButton,
            { padding: moderateScale(15) },
          ]}
        >
          <Image
            source={require("../assets/Images/back-dark-blue.png")}
            style={{
              width: moderateScale(20),
              height: moderateScale(20),
              marginRight: moderateScale(10),
            }}
          />
          <Text
            style={[
              LeaveStyle.LeaveBackButtonTitle,
              { fontSize: moderateScale(14) },
            ]}
          >
            Leaves
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={[LeaveStyle.LeaveTitlesContainer, { height: moderateScale(40) }]}
      >
        <View
          style={[
            LeaveStyle.LeaveTitleLeftContainer,
            { marginLeft: moderateScale(6) },
          ]}
        >
          <Text
            style={[LeaveStyle.LeaveTitleText, { fontSize: moderateScale(14) }]}
          >
            Discription
          </Text>
        </View>
        <View style={LeaveStyle.LeaveTitleLeftContainer}>
          <Text
            style={[
              LeaveStyle.LeaveTitleText,
              { fontSize: moderateScale(14), textAlign: "center" },
            ]}
          >
            Date
          </Text>
        </View>
        <View style={LeaveStyle.LeaveTitleContainer}>
          <Text
            style={[LeaveStyle.LeaveTitleText, { fontSize: moderateScale(14) }]}
          >
            Shift
          </Text>
        </View>
        <View style={LeaveStyle.LeaveTitleContainer}>
          <Text
            style={[LeaveStyle.LeaveTitleText, { fontSize: moderateScale(14) }]}
          >
            Status
          </Text>
        </View>
      </View>
      {load ? (
        <View style={HomeStyle.HomeContentContainer}>
          <Image
            source={require("../assets/Images/loader-1.gif")}
            style={{
              width: moderateScale(100),
              height: moderateScale(100),
            }}
          />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ alignItems: "center" }}
          style={{ flex: 1, width: "100%" }}
          showsVerticalScrollIndicator={false}
        >
          {data?.getLeaveListForMobile?.map(
            (attendance: any, index: number) => (
              <Animatable.View
                style={[
                  LeaveStyle.LeaveBodyContainer,
                  { height: moderateScale(55) },
                ]}
                key={index}
                animation={load ? "fadeInUp" : "fadeInUp"}
              >
                <View
                  style={[
                    LeaveStyle.LeaveTitleLeftContainer,
                    { marginLeft: moderateScale(6) },
                  ]}
                >
                  <Text
                    style={[
                      LeaveStyle.LeaveBodyReasonText,
                      { fontSize: moderateScale(12) },
                    ]}
                  >
                    {attendance?.description}
                  </Text>
                </View>
                <View style={LeaveStyle.LeaveTitleLeftContainer}>
                  <Text
                    style={[
                      LeaveStyle.LeaveBodyText,
                      { fontSize: moderateScale(12), textAlign: "center" },
                    ]}
                  >
                    {attendance?.date}
                  </Text>
                </View>
                <View style={LeaveStyle.LeaveTitleContainer}>
                  <Text
                    style={[
                      LeaveStyle.LeaveBodyText,
                      { fontSize: moderateScale(12) },
                    ]}
                  >
                    {attendance?.shife ? attendance?.shife : "--:--"}
                  </Text>
                </View>
                <TouchableOpacity
                  style={LeaveStyle.LeaveTitleContainer}
                  onPress={() => {
                    if (attendance?.status === "pending") {
                      handleCheckOpen();
                      setLeaveId(attendance?._id);
                    }
                  }}
                  activeOpacity={attendance?.status === "pending" ? 0.2 : 1}
                >
                  <Text
                    style={[
                      LeaveStyle.LeaveApproveText,
                      {
                        fontSize: moderateScale(12),
                        color:
                          attendance?.status === "cancel"
                            ? "red"
                            : attendance?.status === "approve"
                            ? "green"
                            : attendance?.status === "pending"
                            ? "orange"
                            : "black",
                      },
                    ]}
                  >
                    {attendance?.status}
                  </Text>
                </TouchableOpacity>
              </Animatable.View>
            )
          )}

          {leavListData?.length >= limit ? (
            <TouchableOpacity
              onPress={() => {
                setLimit(10 + limit);
              }}
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                height: moderateScale(40),
              }}
            >
              <Text
                style={{
                  textTransform: "lowercase",
                  fontFamily: "Kantumruy-Bold",
                  color: "#4cbb17",
                  fontSize: moderateScale(16),
                }}
              >
                {"see more..."}
              </Text>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      )}
    </View>
  );
}
