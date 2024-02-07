import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import MeetingStyle from "../styles/MeetingStyle.scss";
import PayslipStyle from "../styles/PayslipStyle.scss";
import { useNavigate } from "react-router-native";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { moderateScale } from "../ Metrics";
import { useQuery } from "@apollo/client";
import { GETEMPPAYROLLHISTORYFORMOBILE } from "../graphql/GetEmpPayrollHistoryForMobile";
import moment from "moment";
import { useTranslation } from "react-multi-lang";
import { COLORS } from "../color";

export default function PayslipScreen() {
  const navigate = useNavigate();
  const { dimension } = useContext(AuthContext);
  const [limit, setLimit] = useState(10);
  const [empPayrollhistorys, setEmpPayrollhistorys] = useState([]);
  const { widthScreen } = useContext(AuthContext);
  const t = useTranslation();

  const { data, refetch } = useQuery(GETEMPPAYROLLHISTORYFORMOBILE, {
    variables: {
      limit: limit,
    },
    onCompleted: ({ getEmpPayrollHistoryForMobile }) => {
      setEmpPayrollhistorys(getEmpPayrollHistoryForMobile);
    },
  });

  useEffect(() => {
    refetch();
  }, [limit]);

  // Render item function
  const renderItem = ({ item }: any) => (
    <View>
      <TouchableOpacity
        style={[
          PayslipStyle.PayslipButtonContainer,
          {
            marginTop: moderateScale(10),
            width: widthScreen * 0.9,
            padding: moderateScale(10),
            borderWidth: moderateScale(1),
            borderRadius: moderateScale(10),
          },
        ]}
        onPress={() => navigate("/monthlypayslip", { state: item?._id })}
      >
        <Image
          source={require("../assets/Images/security.png")}
          style={{
            width: moderateScale(50),
            height: moderateScale(50),
            marginRight: moderateScale(10),
          }}
        />
        <View>
          <Text
            style={[MeetingStyle.MeetingTitle, { fontSize: moderateScale(14) }]}
          >
            {t("Payslip for the month of")}{" "}
            {moment(item.date).format("MMM YYYY")}
          </Text>
          <Text
            style={[
              MeetingStyle.MonthlyPayslipGrossBody,
              { fontSize: moderateScale(14) },
            ]}
          >
            {t("seemore")}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View
      style={[
        MeetingStyle.MeetingContainer,
        {
          borderTopWidth: moderateScale(1),
          borderLeftWidth: moderateScale(1),
          borderRightWidth: moderateScale(1),
          borderTopLeftRadius: moderateScale(15),
          borderTopRightRadius: moderateScale(15),
        },
      ]}
    >
      <View style={MeetingStyle.MeetingBackButtonContainer}>
        <TouchableOpacity
          onPress={() => navigate("/home")}
          style={[
            MeetingStyle.MeetingBackButton,
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
              MeetingStyle.MeetingBackButtonTitle,
              { fontSize: moderateScale(14) },
            ]}
          >
            {t("Payslip")}
          </Text>
        </TouchableOpacity>
      </View>
      {empPayrollhistorys?.length === 0 ? (
        <View
          style={{
            flex: 1,
            width: "100%",
            backgroundColor: COLORS.WHITE,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={[
              MeetingStyle.MeetingBackButtonTitle,
              { fontSize: moderateScale(14) },
            ]}
          >
            {t("Empty")}
          </Text>
        </View>
      ) : (
        <View style={{ flex: 1, width: "100%" }}>
          <FlatList
            initialNumToRender={10} // Adjust as needed
            maxToRenderPerBatch={10} // Adjust as needed
            windowSize={10} // Adjust as needed
            data={empPayrollhistorys?.slice(0, limit)}
            keyExtractor={(item: any) => item._id.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{
              justifyContent: "center",
              alignItems: "center",
            }}
            style={{
              width: "100%",
            }}
            onEndReached={() => {
              if (empPayrollhistorys.length >= limit) {
                setLimit(10 + limit);
                // console.log(limit);
              }
            }}
            onEndReachedThreshold={0.1} // Adjust this threshold as needed
          />
        </View>
      )}
    </View>
  );
}
