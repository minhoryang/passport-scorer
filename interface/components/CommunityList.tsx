// --- React components/methods
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";

// --- Components
import { RepeatIcon } from "@chakra-ui/icons";
import CommunityCard from "./CommunityCard";
import ModalTemplate from "./ModalTemplate";
import NoValues from "./NoValues";

// --- Utils
import {
  createCommunity,
  getCommunities,
  updateCommunity,
  deleteCommunity,
  Community,
} from "../utils/account-requests";
import {
  Input,
  Card,
  CardBody,
  Stack,
  Heading,
  CardFooter,
  Button,
  Text,
  Icon,
  SimpleGrid,
  Center,
  Box,
} from "@chakra-ui/react";

const CommunityList = () => {
  const router = useRouter();
  const [createCommunityModalOpen, setCreateCommunityModalOpen] =
    useState(false);
  const [updateCommunityModalOpen, setUpdateCommunityModalOpen] =
    useState(false);
  const [communityName, setCommunityName] = useState("");
  const [communityDescription, setCommunityDescription] = useState("");
  const [updatedCommunityDescription, setUpdatedCommunityDescription] =
    useState("");
  const [updatedCommunityName, setUpdatedCommunityName] = useState("");
  const [updatedCommunityId, setUpdatedCommunityId] =
    useState<Community["id"]>();
  const [error, setError] = useState<undefined | string>();
  const [communities, setCommunities] = useState<Community[]>([]);

  const handleCreateCommunity = async () => {
    try {
      await createCommunity({
        name: communityName,
        description: communityDescription,
      });
      setCommunityName("");
      setCommunityDescription("");
      await fetchCommunities();
      setCreateCommunityModalOpen(false);
    } catch (error) {
      console.log({ error });
    }
  };

  const fetchCommunities = useCallback(async () => {
    try {
      setCommunities(await getCommunities());
    } catch (error) {
      console.log({ error });
      setError("There was an error fetching your Communities.");
    }
  }, []);

  useEffect(() => {
    fetchCommunities();
  }, []);

  const handleUpdateCommunity = async (communityId: Community["id"]) => {
    try {
      await updateCommunity(communityId, {
        name: updatedCommunityName,
        description: updatedCommunityDescription,
      });
      setUpdatedCommunityName("");
      setUpdatedCommunityDescription("");
      await fetchCommunities();
      setUpdateCommunityModalOpen(false);
    } catch (error) {
      console.log({ error });
    }
  };

  const handleDeleteCommunity = async (communityId: Community["id"]) => {
    try {
      await deleteCommunity(communityId);
      await fetchCommunities();
    } catch (error) {
      console.error(error);
    }
  };

  const communityList = communities.map((community: Community, i: number) => {
    return (
      <CommunityCard
        key={i}
        community={community}
        communityId={community.id}
        setUpdateCommunityModalOpen={setUpdateCommunityModalOpen}
        handleDeleteCommunity={handleDeleteCommunity}
        setUpdatedCommunityId={setUpdatedCommunityId}
        setUpdatedCommunityName={setUpdatedCommunityName}
        setUpdatedCommunityDescription={setUpdatedCommunityDescription}
      />
    );
  });

  return (
    <>
      {communities.length === 0 ? (
        <NoValues
          title="My Communities"
          description="Manage how your dapps interact with the Gitcoin Passport by creating a
        key that will connect to any community."
          addRequest={() => {
            setCommunityName("");
            setCommunityDescription("");
            setCreateCommunityModalOpen(true);
          }}
          icon={
            <RepeatIcon viewBox="0 0 25 25" boxSize="1.9em" color="#757087" />
          }
        />
      ) : (
        <div className="mx-5 mt-4">
          {communityList}
          <button
            onClick={() => router.push("/dashboard/api-keys")}
            className="text-md mt-5 mr-5 rounded-sm bg-purple-softpurple  py-1 px-6 font-librefranklin text-white"
          >
            <span className="text-lg">+</span> Configure API Keys
          </button>
          <button
            data-testid="open-community-modal"
            onClick={() => {
              setCommunityName("");
              setCommunityDescription("");
              setUpdatedCommunityName("");
              setUpdatedCommunityDescription("");
              setCreateCommunityModalOpen(true);
            }}
            className="text-md mt-5 rounded-sm border-2 border-gray-lightgray py-1 px-6 font-librefranklin text-blue-darkblue "
            disabled={communities.length >= 5}
          >
            <span className="text-lg">+</span> Create a Community
          </button>
          {error && <div>{error}</div>}
        </div>
      )}
      <ModalTemplate
        isOpen={createCommunityModalOpen}
        onClose={() => setCreateCommunityModalOpen(false)}
      >
        <Center>
          <Box
            borderRadius="24"
            backgroundColor="#F0EBFF"
            width="48px"
            height="48px"
          >
            <Center>
              <Icon className="pt-3">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 2C1 1.44772 1.44772 1 2 1H16C16.5523 1 17 1.44772 17 2V4C17 4.55228 16.5523 5 16 5H2C1.44772 5 1 4.55228 1 4V2Z"
                    stroke="#6F3FF5"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M1 10C1 9.44772 1.44772 9 2 9H8C8.55228 9 9 9.44772 9 10V16C9 16.5523 8.55228 17 8 17H2C1.44772 17 1 16.5523 1 16V10Z"
                    stroke="#6F3FF5"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M13 10C13 9.44772 13.4477 9 14 9H16C16.5523 9 17 9.44772 17 10V16C17 16.5523 16.5523 17 16 17H14C13.4477 17 13 16.5523 13 16V10Z"
                    stroke="#6F3FF5"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </Icon>
            </Center>
          </Box>
        </Center>
        <Center>
          <Text>Select a Usecase</Text>
        </Center>
        <Center>
          <Text>What will this Scorer be used for?</Text>
        </Center>

        <SimpleGrid columns={2} spacing={10}>
          <Card direction="row">
            <Icon boxSize={18} className="mt-4">
              <svg
                width="18"
                height="14"
                viewBox="0 0 18 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M4.05025 0.635667C4.44078 1.02619 4.44078 1.65936 4.05025 2.04988C1.31658 4.78355 1.31658 9.2157 4.05025 11.9494C4.44078 12.3399 4.44078 12.9731 4.05025 13.3636C3.65973 13.7541 3.02656 13.7541 2.63604 13.3636C-0.87868 9.84887 -0.87868 4.15038 2.63604 0.635667C3.02656 0.245142 3.65973 0.245142 4.05025 0.635667ZM13.9498 0.635899C14.3403 0.245375 14.9735 0.245375 15.364 0.635899C18.8787 4.15062 18.8787 9.8491 15.364 13.3638C14.9735 13.7543 14.3403 13.7543 13.9498 13.3638C13.5592 12.9733 13.5592 12.3401 13.9498 11.9496C16.6834 9.21594 16.6834 4.78378 13.9498 2.05011C13.5592 1.65959 13.5592 1.02642 13.9498 0.635899ZM6.87869 3.46409C7.26921 3.85462 7.26921 4.48778 6.87869 4.87831C5.70711 6.04988 5.70711 7.94938 6.87869 9.12095C7.26921 9.51147 7.26921 10.1446 6.87868 10.5352C6.48816 10.9257 5.855 10.9257 5.46447 10.5352C3.51185 8.58254 3.51185 5.41672 5.46447 3.46409C5.855 3.07357 6.48816 3.07357 6.87869 3.46409ZM11.1213 3.46433C11.5119 3.0738 12.145 3.0738 12.5355 3.46433C14.4882 5.41695 14.4882 8.58277 12.5355 10.5354C12.145 10.9259 11.5119 10.9259 11.1213 10.5354C10.7308 10.1449 10.7308 9.5117 11.1213 9.12118C12.2929 7.94961 12.2929 6.05011 11.1213 4.87854C10.7308 4.48801 10.7308 3.85485 11.1213 3.46433ZM9 5.99986C9.55229 5.99986 10 6.44757 10 6.99986V7.00986C10 7.56214 9.55229 8.00986 9 8.00986C8.44772 8.00986 8 7.56214 8 7.00986V6.99986C8 6.44757 8.44772 5.99986 9 5.99986Z"
                  fill="#111827"
                />
              </svg>
            </Icon>
            <Stack>
              <CardBody>
                <Heading size="md">Airdrop Protection</Heading>
                <Text py="2">
                  I want to ensure my airdrop goes to real humans and not
                  farmers.
                </Text>
              </CardBody>
            </Stack>
          </Card>
          <Card direction="row">
            <Icon className="mt-4">
              <svg
                width="18"
                height="16"
                viewBox="0 0 18 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M5.62478 0.654579C6.6684 0.232134 7.80833 0 9 0C13.9706 0 18 4.02944 18 9C18 9.55229 17.5523 10 17 10C16.4477 10 16 9.55229 16 9C16 5.13401 12.866 2 9 2C8.06987 2 7.18446 2.18088 6.37522 2.50845C5.86328 2.71568 5.28029 2.46867 5.07306 1.95673C4.86584 1.4448 5.11285 0.861804 5.62478 0.654579ZM3.66173 2.95861C4.0758 3.32408 4.1152 3.95602 3.74974 4.37008C2.66007 5.60467 2 7.22404 2 9C2 9.55229 1.55228 10 1 10C0.447715 10 0 9.55229 0 9C0 6.71818 0.850477 4.63256 2.25026 3.04662C2.61573 2.63255 3.24766 2.59315 3.66173 2.95861Z"
                  fill="#111827"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M4 9C4 6.23858 6.23857 4 9 4C11.7614 4 14 6.23858 14 9C14 9.55228 13.5523 10 13 10C12.4477 10 12 9.55228 12 9C12 7.34315 10.6569 6 9 6C7.34315 6 6 7.34315 6 9C6 10.6772 5.65535 12.2764 5.03206 13.7288C4.81426 14.2363 4.22626 14.4712 3.71874 14.2533C3.21122 14.0355 2.97636 13.4475 3.19416 12.94C3.71247 11.7323 4 10.401 4 9ZM12.9212 11.0123C13.4666 11.0989 13.8387 11.6112 13.7521 12.1567C13.6205 12.9867 13.4378 13.7998 13.2072 14.5928C13.0531 15.1231 12.4982 15.428 11.9679 15.2739C11.4375 15.1197 11.1326 14.5648 11.2868 14.0345C11.494 13.3215 11.6584 12.5901 11.7768 11.8433C11.8634 11.2979 12.3757 10.9258 12.9212 11.0123Z"
                  fill="#111827"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M9 8C9.55228 8 10 8.44771 10 9C10 11.2363 9.54063 13.3679 8.71014 15.3036C8.49239 15.8111 7.90441 16.046 7.39687 15.8283C6.88933 15.6105 6.65441 15.0225 6.87217 14.515C7.59772 12.8239 8 10.9602 8 9C8 8.44771 8.44771 8 9 8Z"
                  fill="#111827"
                />
              </svg>
            </Icon>
            <Stack>
              <CardBody>
                <Heading size="md">Sybil Prevention</Heading>
                <Text py="2">
                  I need to ensure my community or app is not attacked.
                </Text>
              </CardBody>
            </Stack>
          </Card>
          <Card direction="row">
            <Icon className="mt-4">
              <svg
                width="14"
                height="16"
                viewBox="0 0 14 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 1C6 0.447715 6.44772 0 7 0C7.55228 0 8 0.447715 8 1V6.5C8 6.77614 8.22386 7 8.5 7C8.77614 7 9 6.77614 9 6.5V2C9 1.44772 9.44771 1 10 1C10.5523 1 11 1.44772 11 2V6.5C11 6.77614 11.2239 7 11.5 7C11.7761 7 12 6.77614 12 6.5V4C12 3.44772 12.4477 3 13 3C13.5523 3 14 3.44772 14 4V9C14 12.866 10.866 16 7 16C3.13401 16 0 12.866 0 9V7C0 6.44772 0.447715 6 1 6C1.55228 6 2 6.44772 2 7V9.5C2 9.77614 2.22386 10 2.5 10C2.77614 10 3 9.77614 3 9.5V2C3 1.44772 3.44772 1 4 1C4.55228 1 5 1.44772 5 2V6.5C5 6.77614 5.22386 7 5.5 7C5.77614 7 6 6.77614 6 6.5V1Z"
                  fill="#111827"
                />
              </svg>
            </Icon>
            <Stack>
              <CardBody>
                <Heading size="md">Bot prevention</Heading>
                <Text py="2">
                  I want my community or app to be safe from bots.
                </Text>
              </CardBody>
            </Stack>
          </Card>
          <Card direction="row">
            <Icon className="mt-4">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM5 7H3V9H5V7ZM13 7H11V9H13V7ZM7 7H9V9H7V7Z"
                  fill="#111827"
                />
              </svg>
            </Icon>
            <Stack>
              <CardBody>
                <Heading size="md">Other</Heading>
                <Text py="2">It’s something else, or I’m not sure yet. </Text>
              </CardBody>
            </Stack>
          </Card>
        </SimpleGrid>
      </ModalTemplate>
      <ModalTemplate
        title="Update Community"
        isOpen={updateCommunityModalOpen}
        onClose={() => setUpdateCommunityModalOpen(false)}
      >
        <div className="flex flex-col">
          <label className="text-gray-softgray font-librefranklin text-xs">
            Community Name
          </label>
          <Input
            data-testid="update-community-name-input"
            className="mb-4"
            value={updatedCommunityName}
            onChange={(name) => setUpdatedCommunityName(name.target.value)}
            placeholder="Community name"
          />
          <label className="text-gray-softgray font-librefranklin text-xs">
            Community Description
          </label>
          <Input
            data-testid="update-community-description-input"
            value={updatedCommunityDescription}
            onChange={(description) =>
              setUpdatedCommunityDescription(description.target.value)
            }
            placeholder="Community Description"
          />
          <div className="flex w-full justify-end">
            <button
              disabled={!updatedCommunityName && !updatedCommunityDescription}
              data-testid="save-button"
              className="mt-6 mb-2 rounded bg-purple-softpurple py-2 px-4 text-white disabled:opacity-25"
              onClick={() => handleUpdateCommunity(updatedCommunityId)}
            >
              Save
            </button>
            {error && <div>{error}</div>}
          </div>
        </div>
      </ModalTemplate>
    </>
  );
};

export default CommunityList;
